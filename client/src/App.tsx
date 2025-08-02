import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Settings, Home as HomeIcon } from "lucide-react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import BlockingPeriods from "@/pages/blocking-periods";

function Router() {
  const [location] = useLocation();
  
  return (
    <div className="min-h-screen bg-navy-900">
      {/* Navigation */}
      <nav className="bg-navy-800 border-b border-slate-700 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-poppins font-bold text-xl text-white">Text Your Ex?</h1>
            <div className="flex gap-2">
              <Link href="/">
                <Button
                  variant={location === "/" ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <HomeIcon className="w-4 h-4" />
                  Main App
                </Button>
              </Link>
              <Link href="/blocking-periods">
                <Button
                  variant={location === "/blocking-periods" ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Blocking Periods
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <Switch>
        <Route path="/" component={Home}/>
        <Route path="/blocking-periods" component={BlockingPeriods} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
