import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Clock, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const blockingPeriodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  daysOfWeek: z.array(z.string()).min(1, "Select at least one day"),
  isActive: z.boolean().default(true),
});

type BlockingPeriodForm = z.infer<typeof blockingPeriodSchema>;

interface BlockingPeriod {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
  isActive: boolean;
  createdAt: Date;
}

const DAYS_OF_WEEK = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

const PRESET_PERIODS = [
  {
    name: "Late Night Vulnerability",
    startTime: "22:00",
    endTime: "02:00",
    daysOfWeek: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
  },
  {
    name: "Weekend Weakness",
    startTime: "18:00",
    endTime: "23:59",
    daysOfWeek: ["friday", "saturday", "sunday"],
  },
  {
    name: "Lonely Lunch Break",
    startTime: "12:00",
    endTime: "14:00",
    daysOfWeek: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  },
];

export default function BlockingPeriods() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<BlockingPeriod | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BlockingPeriodForm>({
    resolver: zodResolver(blockingPeriodSchema),
    defaultValues: {
      name: "",
      startTime: "22:00",
      endTime: "02:00",
      daysOfWeek: [],
      isActive: true,
    },
  });

  // Fetch blocking periods
  const { data: periods = [], isLoading } = useQuery<BlockingPeriod[]>({
    queryKey: ["/api/blocking-periods"],
  });

  // Fetch current blocking status
  const { data: blockingStatus } = useQuery<{
    isBlocked: boolean;
    activePeriods: BlockingPeriod[];
    currentTime: string;
    currentDay: string;
  }>({
    queryKey: ["/api/blocking-status"],
    refetchInterval: 60000, // Refresh every minute
  });

  // Create blocking period mutation
  const createMutation = useMutation({
    mutationFn: (data: BlockingPeriodForm) => apiRequest("/api/blocking-periods", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blocking-periods"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blocking-status"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success!",
        description: "Blocking period created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create blocking period.",
        variant: "destructive",
      });
    },
  });

  // Update blocking period mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BlockingPeriodForm> }) =>
      apiRequest(`/api/blocking-periods/${id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blocking-periods"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blocking-status"] });
      toast({
        title: "Success!",
        description: "Blocking period updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update blocking period.",
        variant: "destructive",
      });
    },
  });

  // Delete blocking period mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/blocking-periods/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blocking-periods"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blocking-status"] });
      toast({
        title: "Success!",
        description: "Blocking period deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete blocking period.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BlockingPeriodForm) => {
    if (editingPeriod) {
      updateMutation.mutate({ id: editingPeriod.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (period: BlockingPeriod) => {
    setEditingPeriod(period);
    form.reset({
      name: period.name,
      startTime: period.startTime,
      endTime: period.endTime,
      daysOfWeek: period.daysOfWeek,
      isActive: period.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this blocking period?")) {
      deleteMutation.mutate(id);
    }
  };

  const toggleActive = (period: BlockingPeriod) => {
    updateMutation.mutate({
      id: period.id,
      data: { isActive: !period.isActive },
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const usePreset = (preset: typeof PRESET_PERIODS[0]) => {
    form.setValue("name", preset.name);
    form.setValue("startTime", preset.startTime);
    form.setValue("endTime", preset.endTime);
    form.setValue("daysOfWeek", preset.daysOfWeek);
  };

  return (
    <div className="min-h-screen bg-navy-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-poppins font-bold text-4xl mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ex-Blocking Time Periods
          </h1>
          <p className="text-slate-400 text-lg">
            Set up custom time periods when you're most vulnerable to texting your ex
          </p>
        </motion.div>

        {/* Current Status */}
        {blockingStatus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <Card className={`border-2 ${blockingStatus.isBlocked ? 'border-red-500 bg-red-950/50' : 'border-green-500 bg-green-950/50'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Current Status: {blockingStatus.currentTime}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {blockingStatus.isBlocked ? (
                  <div className="text-red-400">
                    <p className="font-semibold mb-2">🚨 BLOCKING PERIOD ACTIVE</p>
                    <p className="text-sm">
                      Active periods: {blockingStatus.activePeriods?.map((p) => p.name).join(", ")}
                    </p>
                  </div>
                ) : (
                  <p className="text-green-400 font-semibold">✅ No active blocking periods right now</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Add New Period Button */}
        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingPeriod(null);
                  form.reset();
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Blocking Period
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-navy-800 border-purple-400 text-white max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingPeriod ? "Edit" : "Create"} Blocking Period
                </DialogTitle>
              </DialogHeader>
              
              {/* Preset buttons */}
              {!editingPeriod && (
                <div className="mb-4">
                  <p className="text-sm text-slate-400 mb-2">Quick presets:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {PRESET_PERIODS.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        size="sm"
                        onClick={() => usePreset(preset)}
                        className="text-xs justify-start"
                      >
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Period Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Late Night Vulnerability"
                            {...field}
                            className="bg-navy-700 border-slate-600"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                              className="bg-navy-700 border-slate-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                              className="bg-navy-700 border-slate-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="daysOfWeek"
                    render={() => (
                      <FormItem>
                        <FormLabel>Days of Week</FormLabel>
                        <div className="grid grid-cols-2 gap-2">
                          {DAYS_OF_WEEK.map((day) => (
                            <FormField
                              key={day.value}
                              control={form.control}
                              name="daysOfWeek"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(day.value)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, day.value])
                                          : field.onChange(field.value?.filter((value) => value !== day.value));
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm">{day.label}</FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel>Active</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="bg-purple-600 hover:bg-purple-700 flex-1"
                    >
                      {editingPeriod ? "Update" : "Create"} Period
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Periods List */}
        <div className="space-y-4">
          <AnimatePresence>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
                <p className="mt-2 text-slate-400">Loading blocking periods...</p>
              </div>
            ) : periods.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg mb-2">No blocking periods set up yet</p>
                <p className="text-slate-500 text-sm">Create your first period to get protected from vulnerable moments</p>
              </motion.div>
            ) : (
              periods.map((period) => (
                <motion.div
                  key={period.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  layout
                >
                  <Card className={`${period.isActive ? 'border-purple-400' : 'border-slate-600'} bg-navy-800`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{period.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={period.isActive}
                            onCheckedChange={() => toggleActive(period)}
                            disabled={updateMutation.isPending}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(period)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(period.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            {formatTime(period.startTime)} - {formatTime(period.endTime)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {period.daysOfWeek.map(day => day.charAt(0).toUpperCase() + day.slice(1, 3)).join(", ")}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}