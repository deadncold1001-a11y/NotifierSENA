import axios from "axios";
import * as cheerio from "cheerio";
import https from "https";
import { storage } from "../storage";
import { telegramService } from "./telegram";

export class ScraperService {
  async checkForNewPosts(): Promise<{ success: boolean; newPost: boolean; error?: string }> {
    try {
      const config = await storage.getConfig();
      if (!config?.forumUrl) {
        throw new Error("Forum URL not configured");
      }

      await storage.updateStatus({
        lastCheckAt: new Date(),
      });

      const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });

      const response = await axios.get(config.forumUrl, {
        httpsAgent,
        timeout: 30000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      const $ = cheerio.load(response.data);
      const firstPost = $("tr.discussion").first();

      if (firstPost.length === 0) {
        throw new Error("Could not find discussion posts on the page");
      }

      const title = firstPost.text().trim();
      
      if (!title) {
        throw new Error("Found post but title is empty");
      }

      const lastTitle = await storage.getLastPostTitle();

      await storage.updateStatus({
        lastSuccessfulCheckAt: new Date(),
        lastError: null,
      });

      if (lastTitle !== null && title !== lastTitle && title !== "") {
        await storage.setLastPostTitle(title);

        const message = `🆕 <b>Nueva publicación en Zajuna</b>\n\n${title}`;
        await telegramService.sendMessage(message);

        await storage.addNotification({
          message: `New post detected: ${title}`,
          type: "new_post",
        });

        return { success: true, newPost: true };
      } else if (lastTitle === null) {
        await storage.setLastPostTitle(title);
        await storage.addNotification({
          message: "Initial post title captured. Monitoring started.",
          type: "info",
        });
      }

      return { success: true, newPost: false };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      await storage.updateStatus({
        lastError: errorMessage,
      });

      await storage.addNotification({
        message: `Scraping error: ${errorMessage}`,
        type: "error",
      });

      return { success: false, newPost: false, error: errorMessage };
    }
  }
}

export const scraperService = new ScraperService();
