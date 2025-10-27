import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { monitorService } from "./services/monitor";
import { scraperService } from "./services/scraper";
import { telegramService } from "./services/telegram";
import { updateConfigSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/status", async (req, res) => {
    try {
      const status = await storage.getStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch status" });
    }
  });

  app.get("/api/config", async (req, res) => {
    try {
      const config = await storage.getConfig();
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch configuration" });
    }
  });

  app.post("/api/config", async (req, res) => {
    try {
      const validatedData = updateConfigSchema.parse(req.body);
      const config = await storage.updateConfig(validatedData);
      
      const currentStatus = await storage.getStatus();
      if (currentStatus?.isRunning) {
        await monitorService.restart();
      }

      res.json(config);
    } catch (error) {
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Invalid configuration" 
      });
    }
  });

  app.get("/api/notifications", async (req, res) => {
    try {
      const notifications = await storage.getNotifications(50);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.post("/api/test-telegram", async (req, res) => {
    try {
      await telegramService.testConnection();
      res.json({ success: true, message: "Test message sent successfully" });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to send test message" 
      });
    }
  });

  app.post("/api/manual-check", async (req, res) => {
    try {
      const status = await storage.getStatus();
      if (!status?.isRunning) {
        return res.status(400).json({ error: "Service is not running" });
      }

      const result = await scraperService.checkForNewPosts();
      res.json({ 
        success: result.success, 
        newPost: result.newPost,
        message: result.newPost 
          ? "New post detected!" 
          : result.success 
            ? "No new posts found" 
            : "Check failed"
      });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Manual check failed" 
      });
    }
  });

  app.post("/api/service/start", async (req, res) => {
    try {
      await monitorService.start();
      const status = await storage.getStatus();
      res.json({ success: true, status });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to start service" 
      });
    }
  });

  app.post("/api/service/stop", async (req, res) => {
    try {
      await monitorService.stop();
      const status = await storage.getStatus();
      res.json({ success: true, status });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to stop service" 
      });
    }
  });

  app.post("/api/service/restart", async (req, res) => {
    try {
      await monitorService.restart();
      const status = await storage.getStatus();
      res.json({ success: true, status });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to restart service" 
      });
    }
  });

  app.post("/api/health-check", async (req, res) => {
    try {
      await monitorService.healthCheck();
      res.json({ success: true, message: "Health check sent to Telegram" });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Health check failed" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
