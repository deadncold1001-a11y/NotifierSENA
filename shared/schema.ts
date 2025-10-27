import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Configuration for the monitoring service
export const monitoringConfig = pgTable("monitoring_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  telegramBotToken: text("telegram_bot_token").notNull(),
  telegramChatId: text("telegram_chat_id").notNull(),
  forumUrl: text("forum_url").notNull(),
  checkInterval: integer("check_interval").notNull().default(30), // in minutes
  isActive: boolean("is_active").notNull().default(false),
  lastPostTitle: text("last_post_title"),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Notification history
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  message: text("message").notNull(),
  type: text("type").notNull(), // 'success', 'error', 'info', 'new_post'
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Service status and health metrics
export const serviceStatus = pgTable("service_status", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  isRunning: boolean("is_running").notNull().default(false),
  lastCheckAt: timestamp("last_check_at"),
  lastSuccessfulCheckAt: timestamp("last_successful_check_at"),
  totalNotificationsSent: integer("total_notifications_sent").notNull().default(0),
  serviceStartedAt: timestamp("service_started_at"),
  lastError: text("last_error"),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Insert schemas
export const insertMonitoringConfigSchema = createInsertSchema(monitoringConfig).omit({
  id: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertServiceStatusSchema = createInsertSchema(serviceStatus).omit({
  id: true,
  updatedAt: true,
});

// Types
export type MonitoringConfig = typeof monitoringConfig.$inferSelect;
export type InsertMonitoringConfig = z.infer<typeof insertMonitoringConfigSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type ServiceStatus = typeof serviceStatus.$inferSelect;
export type InsertServiceStatus = z.infer<typeof insertServiceStatusSchema>;

// Additional schemas for API requests
export const updateConfigSchema = z.object({
  telegramBotToken: z.string().min(1, "Bot token is required"),
  telegramChatId: z.string().min(1, "Chat ID is required"),
  forumUrl: z.string().url("Must be a valid URL"),
  checkInterval: z.number().min(1).max(1440).default(30),
});

export type UpdateConfig = z.infer<typeof updateConfigSchema>;
