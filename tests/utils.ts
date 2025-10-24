import { Page } from "@playwright/test";

export class NotificationTestUtils {
  constructor(private page: Page) {}

  async createNotification(data: {
    message: string;
    templateName?: string;
    recipientType?: "ALL" | "SELECTED";
    sendDate?: string;
    recurrence?: "ONE_TIME" | "WEEKLY" | "MONTHLY";
  }) {
    // Click create notification button
    await this.page.click('button:has-text("Create Notification")');

    // Fill in the form
    await this.page.fill('input[name="message"]', data.message);

    if (data.templateName) {
      await this.page.selectOption(
        'select[name="templateName"]',
        data.templateName
      );
    }

    if (data.recipientType) {
      await this.page.selectOption(
        'select[name="recipientType"]',
        data.recipientType
      );
    }

    if (data.sendDate) {
      await this.page.fill('input[name="sendDate"]', data.sendDate);
    }

    if (data.recurrence) {
      await this.page.selectOption(
        'select[name="recurrence"]',
        data.recurrence
      );
    }

    // Submit the form
    await this.page.click('button:has-text("Create")');

    // Wait for success message
    await this.page.waitForSelector("text=Notification created");
  }

  async getNotificationCards() {
    return this.page.locator('[data-testid="notification-card"]');
  }

  async getNotificationByMessage(message: string) {
    return this.page.locator(
      `[data-testid="notification-card"]:has-text("${message}")`
    );
  }

  async editNotification(message: string, newMessage: string) {
    const notification = await this.getNotificationByMessage(message);
    await notification.locator('button[aria-label="Open menu"]').click();
    await this.page.click("text=Edit");

    await this.page.fill('input[name="message"]', newMessage);
    await this.page.click('button:has-text("Update")');

    await this.page.waitForSelector("text=Notification updated");
  }

  async deleteNotification(message: string) {
    const notification = await this.getNotificationByMessage(message);
    await notification.locator('button[aria-label="Open menu"]').click();
    await this.page.click("text=Delete");
    await this.page.click('button:has-text("Confirm")');

    await this.page.waitForSelector("text=Notification deleted");
  }

  async sendNotification(message: string) {
    const notification = await this.getNotificationByMessage(message);
    await notification.locator('button[aria-label="Open menu"]').click();
    await this.page.click("text=Send Now");

    await this.page.waitForSelector("text=Notification sent successfully");
  }

  async searchNotifications(query: string) {
    const searchInput = this.page.locator(
      'input[placeholder*="Buscar notificaciones"]'
    );
    await searchInput.fill(query);
    // Wait for search results to load
    await this.page.waitForTimeout(500);
  }

  async getTomorrowDateString(): Promise<string> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }
}
