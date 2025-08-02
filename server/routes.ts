import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlockingPeriodSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Blocking Periods Routes
  app.get("/api/blocking-periods", async (req, res) => {
    try {
      // For now, using a dummy user ID since we don't have authentication
      const userId = "dummy-user-id";
      const periods = await storage.getBlockingPeriods(userId);
      res.json(periods);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blocking periods" });
    }
  });

  app.post("/api/blocking-periods", async (req, res) => {
    try {
      const validatedData = insertBlockingPeriodSchema.parse({
        ...req.body,
        userId: "dummy-user-id", // For now, using dummy user ID
      });
      
      const period = await storage.createBlockingPeriod(validatedData);
      res.status(201).json(period);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create blocking period" });
      }
    }
  });

  app.put("/api/blocking-periods/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertBlockingPeriodSchema.partial().parse(req.body);
      
      const period = await storage.updateBlockingPeriod(id, validatedData);
      if (!period) {
        res.status(404).json({ error: "Blocking period not found" });
        return;
      }
      
      res.json(period);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update blocking period" });
      }
    }
  });

  app.delete("/api/blocking-periods/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBlockingPeriod(id);
      
      if (!success) {
        res.status(404).json({ error: "Blocking period not found" });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete blocking period" });
    }
  });

  // Get current blocking status
  app.get("/api/blocking-status", async (req, res) => {
    try {
      const userId = "dummy-user-id";
      const periods = await storage.getBlockingPeriods(userId);
      
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const currentDay = dayNames[now.getDay()];
      
      const activePeriods = periods.filter(period => {
        if (!period.isActive) return false;
        
        const dayMatch = period.daysOfWeek.some(day => 
          day.toLowerCase() === currentDay
        );
        
        if (!dayMatch) return false;
        
        // Check if current time is within the blocking period
        const start = period.startTime;
        const end = period.endTime;
        
        // Handle cases where end time is next day (e.g., 23:00 to 02:00)
        if (end < start) {
          return currentTime >= start || currentTime <= end;
        } else {
          return currentTime >= start && currentTime <= end;
        }
      });
      
      res.json({
        isBlocked: activePeriods.length > 0,
        activePeriods: activePeriods,
        currentTime,
        currentDay
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get blocking status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
