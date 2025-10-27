import TelegramBot from "node-telegram-bot-api";
import { storage } from "../storage";

export class TelegramService {
  private bot: TelegramBot | null = null;

  async initialize() {
    const config = await storage.getConfig();
    if (config?.telegramBotToken) {
      this.bot = new TelegramBot(config.telegramBotToken, { polling: false });
    }
  }

  async sendMessage(message: string): Promise<boolean> {
    try {
      const config = await storage.getConfig();
      if (!config?.telegramBotToken || !config?.telegramChatId) {
        throw new Error("Telegram configuration is incomplete");
      }

      if (!this.bot) {
        this.bot = new TelegramBot(config.telegramBotToken, { polling: false });
      }

      await this.bot.sendMessage(config.telegramChatId, message, {
        parse_mode: "HTML",
      });

      const status = await storage.getStatus();
      await storage.updateStatus({
        totalNotificationsSent: (status?.totalNotificationsSent || 0) + 1,
      });

      await storage.addNotification({
        message,
        type: "success",
      });

      return true;
    } catch (error) {
      console.error("Failed to send Telegram message:", error);
      await storage.addNotification({
        message: `Failed to send Telegram message: ${error instanceof Error ? error.message : "Unknown error"}`,
        type: "error",
      });
      return false;
    }
  }

  async testConnection(): Promise<void> {
    const config = await storage.getConfig();
    if (!config?.telegramBotToken || !config?.telegramChatId) {
      throw new Error("Telegram configuration is incomplete");
    }

    const testBot = new TelegramBot(config.telegramBotToken, { polling: false });
    await testBot.sendMessage(
      config.telegramChatId,
      "✅ Test message from Forum Monitor\n\nYour Telegram connection is working correctly!"
    );
  }
}

export const telegramService = new TelegramService();
