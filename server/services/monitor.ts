import cron, { type ScheduledTask } from "node-cron";
import { storage } from "../storage";
import { scraperService } from "./scraper";
import { telegramService } from "./telegram";

export class MonitorService {
  private cronJob: ScheduledTask | null = null;
  private isRunning: boolean = false;
  private watchdogInterval: NodeJS.Timeout | null = null;

  async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error("Service is already running");
    }

    const config = await storage.getConfig();
    if (!config) {
      throw new Error("Configuration not found");
    }

    this.isRunning = true;

    await storage.updateStatus({
      isRunning: true,
      serviceStartedAt: new Date(),
      lastError: null,
    });

    await telegramService.initialize();
    await telegramService.sendMessage("⏰ <b>Bot iniciado correctamente</b>\n\nMonitoring service is now running.");

    await storage.addNotification({
      message: "Monitoring service started",
      type: "success",
    });

    this.scheduleCronJob(config.checkInterval);
    this.startWatchdog();
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      throw new Error("Service is not running");
    }

    this.isRunning = false;

    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
    }

    if (this.watchdogInterval) {
      clearInterval(this.watchdogInterval);
      this.watchdogInterval = null;
    }

    await storage.updateStatus({
      isRunning: false,
      serviceStartedAt: null,
    });

    await storage.addNotification({
      message: "Monitoring service stopped",
      type: "info",
    });

    await telegramService.sendMessage("🛑 <b>Service stopped</b>\n\nMonitoring has been paused.");
  }

  async restart(): Promise<void> {
    if (this.isRunning) {
      await this.stop();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    await this.start();

    await storage.addNotification({
      message: "Monitoring service restarted",
      type: "success",
    });
  }

  private scheduleCronJob(intervalMinutes: number): void {
    if (this.cronJob) {
      this.cronJob.stop();
    }

    const cronExpression = this.getCronExpression(intervalMinutes);
    
    this.cronJob = cron.schedule(cronExpression, async () => {
      if (this.isRunning) {
        await scraperService.checkForNewPosts();
      }
    });
  }

  private getCronExpression(minutes: number): string {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      return `0 */${hours} * * *`;
    }
    return `*/${minutes} * * * *`;
  }

  private startWatchdog(): void {
    this.watchdogInterval = setInterval(async () => {
      if (this.isRunning) {
        const status = await storage.getStatus();
        
        if (status?.lastCheckAt) {
          const timeSinceLastCheck = Date.now() - new Date(status.lastCheckAt).getTime();
          const config = await storage.getConfig();
          const expectedInterval = (config?.checkInterval || 30) * 60 * 1000;
          
          if (timeSinceLastCheck > expectedInterval * 2) {
            await storage.addNotification({
              message: "Watchdog: Service appears to be stalled. Attempting recovery...",
              type: "error",
            });

            await telegramService.sendMessage("🚫 <b>Service appears stalled</b>\n\nAttempting automatic recovery...");

            try {
              await this.restart();
              await telegramService.sendMessage("✅ <b>Service recovered successfully</b>");
            } catch (error) {
              await telegramService.sendMessage("❌ <b>Failed to recover service</b>\n\nManual intervention may be required.");
            }
          }
        }
      }
    }, 5 * 60 * 1000);
  }

  async healthCheck(): Promise<void> {
    const status = await storage.getStatus();
    const config = await storage.getConfig();

    if (status?.isRunning) {
      const uptime = status.serviceStartedAt
        ? Math.floor((Date.now() - new Date(status.serviceStartedAt).getTime()) / 1000 / 60)
        : 0;

      const message = `🟢 <b>Service Status: Running</b>\n\n` +
        `⏱ Uptime: ${uptime} minutes\n` +
        `📊 Total notifications: ${status.totalNotificationsSent}\n` +
        `🔄 Check interval: ${config?.checkInterval} minutes\n` +
        `✅ Last check: ${status.lastCheckAt ? new Date(status.lastCheckAt).toLocaleString() : 'Never'}`;

      await telegramService.sendMessage(message);
    } else {
      await telegramService.sendMessage("🔴 <b>Service Status: Not Running</b>\n\nThe monitoring service is currently stopped.");
    }

    await storage.addNotification({
      message: "Health check completed and sent to Telegram",
      type: "info",
    });
  }

  getStatus(): boolean {
    return this.isRunning;
  }
}

export const monitorService = new MonitorService();
