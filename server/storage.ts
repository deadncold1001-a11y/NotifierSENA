import {
  type MonitoringConfig,
  type InsertMonitoringConfig,
  type Notification,
  type InsertNotification,
  type ServiceStatus,
  type InsertServiceStatus,
  monitoringConfig,
  notifications,
  serviceStatus,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getConfig(): Promise<MonitoringConfig | undefined>;
  updateConfig(config: Partial<InsertMonitoringConfig>): Promise<MonitoringConfig>;
  
  getStatus(): Promise<ServiceStatus | undefined>;
  updateStatus(status: Partial<InsertServiceStatus>): Promise<ServiceStatus>;
  
  addNotification(notification: InsertNotification): Promise<Notification>;
  getNotifications(limit?: number): Promise<Notification[]>;
  
  getLastPostTitle(): Promise<string | null>;
  setLastPostTitle(title: string): Promise<void>;
}

export class DbStorage implements IStorage {
  async initialize() {
    const existingConfig = await db.query.monitoringConfig.findFirst();
    if (!existingConfig) {
      await db.insert(monitoringConfig).values({
        telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "",
        telegramChatId: process.env.TELEGRAM_CHAT_ID || "",
        forumUrl: "https://zajuna.sena.edu.co/zajuna/mod/forum/view.php?id=5024822",
        checkInterval: 30,
        isActive: false,
        lastPostTitle: null,
      });
    }

    const existingStatus = await db.query.serviceStatus.findFirst();
    if (!existingStatus) {
      await db.insert(serviceStatus).values({
        isRunning: false,
        lastCheckAt: null,
        lastSuccessfulCheckAt: null,
        totalNotificationsSent: 0,
        serviceStartedAt: null,
        lastError: null,
      });
    }
  }

  async getConfig(): Promise<MonitoringConfig | undefined> {
    return await db.query.monitoringConfig.findFirst();
  }

  async updateConfig(configData: Partial<InsertMonitoringConfig>): Promise<MonitoringConfig> {
    const existing = await this.getConfig();
    
    if (existing) {
      const [updated] = await db
        .update(monitoringConfig)
        .set({ ...configData, updatedAt: new Date() })
        .where(eq(monitoringConfig.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(monitoringConfig)
      .values({
        telegramBotToken: configData.telegramBotToken || "",
        telegramChatId: configData.telegramChatId || "",
        forumUrl: configData.forumUrl || "",
        checkInterval: configData.checkInterval || 30,
        isActive: configData.isActive || false,
        lastPostTitle: configData.lastPostTitle || null,
      })
      .returning();
    return created;
  }

  async getStatus(): Promise<ServiceStatus | undefined> {
    return await db.query.serviceStatus.findFirst();
  }

  async updateStatus(statusData: Partial<InsertServiceStatus>): Promise<ServiceStatus> {
    const existing = await this.getStatus();
    
    if (existing) {
      const [updated] = await db
        .update(serviceStatus)
        .set({ ...statusData, updatedAt: new Date() })
        .where(eq(serviceStatus.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(serviceStatus)
      .values({
        isRunning: statusData.isRunning || false,
        lastCheckAt: statusData.lastCheckAt || null,
        lastSuccessfulCheckAt: statusData.lastSuccessfulCheckAt || null,
        totalNotificationsSent: statusData.totalNotificationsSent || 0,
        serviceStartedAt: statusData.serviceStartedAt || null,
        lastError: statusData.lastError || null,
      })
      .returning();
    return created;
  }

  async addNotification(notificationData: InsertNotification): Promise<Notification> {
    const [created] = await db
      .insert(notifications)
      .values(notificationData)
      .returning();
    return created;
  }

  async getNotifications(limit: number = 50): Promise<Notification[]> {
    return await db.query.notifications.findMany({
      orderBy: [desc(notifications.createdAt)],
      limit,
    });
  }

  async getLastPostTitle(): Promise<string | null> {
    const config = await this.getConfig();
    return config?.lastPostTitle || null;
  }

  async setLastPostTitle(title: string): Promise<void> {
    const existing = await this.getConfig();
    if (existing) {
      await db
        .update(monitoringConfig)
        .set({ lastPostTitle: title })
        .where(eq(monitoringConfig.id, existing.id));
    }
  }
}

export const storage = new DbStorage();

storage.initialize().catch(console.error);
