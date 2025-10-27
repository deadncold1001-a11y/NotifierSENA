import {
  type MonitoringConfig,
  type InsertMonitoringConfig,
  type Notification,
  type InsertNotification,
  type ServiceStatus,
  type InsertServiceStatus,
} from "@shared/schema";
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private config: MonitoringConfig | null;
  private status: ServiceStatus | null;
  private notifications: Map<string, Notification>;

  constructor() {
    this.config = null;
    this.status = null;
    this.notifications = new Map();
    
    this.initializeDefaults();
  }

  private async initializeDefaults() {
    this.status = {
      id: randomUUID(),
      isRunning: false,
      lastCheckAt: null,
      lastSuccessfulCheckAt: null,
      totalNotificationsSent: 0,
      serviceStartedAt: null,
      lastError: null,
      updatedAt: new Date(),
    };

    this.config = {
      id: randomUUID(),
      telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "",
      telegramChatId: process.env.TELEGRAM_CHAT_ID || "",
      forumUrl: "https://zajuna.sena.edu.co/zajuna/mod/forum/view.php?id=5024822",
      checkInterval: 30,
      isActive: false,
      lastPostTitle: null,
      updatedAt: new Date(),
    };
  }

  async getConfig(): Promise<MonitoringConfig | undefined> {
    return this.config || undefined;
  }

  async updateConfig(configData: Partial<InsertMonitoringConfig>): Promise<MonitoringConfig> {
    if (!this.config) {
      this.config = {
        id: randomUUID(),
        telegramBotToken: "",
        telegramChatId: "",
        forumUrl: "",
        checkInterval: 30,
        isActive: false,
        lastPostTitle: null,
        updatedAt: new Date(),
      };
    }

    this.config = {
      ...this.config,
      ...configData,
      updatedAt: new Date(),
    };

    return this.config;
  }

  async getStatus(): Promise<ServiceStatus | undefined> {
    return this.status || undefined;
  }

  async updateStatus(statusData: Partial<InsertServiceStatus>): Promise<ServiceStatus> {
    if (!this.status) {
      this.status = {
        id: randomUUID(),
        isRunning: false,
        lastCheckAt: null,
        lastSuccessfulCheckAt: null,
        totalNotificationsSent: 0,
        serviceStartedAt: null,
        lastError: null,
        updatedAt: new Date(),
      };
    }

    this.status = {
      ...this.status,
      ...statusData,
      updatedAt: new Date(),
    };

    return this.status;
  }

  async addNotification(notificationData: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = {
      id,
      ...notificationData,
      createdAt: new Date(),
    };

    this.notifications.set(id, notification);
    return notification;
  }

  async getNotifications(limit: number = 50): Promise<Notification[]> {
    const allNotifications = Array.from(this.notifications.values());
    return allNotifications
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getLastPostTitle(): Promise<string | null> {
    return this.config?.lastPostTitle || null;
  }

  async setLastPostTitle(title: string): Promise<void> {
    if (this.config) {
      this.config.lastPostTitle = title;
    }
  }
}

export const storage = new MemStorage();
