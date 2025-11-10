import { expect, Page } from "@playwright/test";

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
    await this.page.click('[data-testid="create-notification-button"]');

    // Fill in the form
    await this.page.fill('[data-testid="notification-form-message-input"]', data.message);

    if (data.templateName) {
      await this.page.fill('[data-testid="notification-form-template-input"]', data.templateName);
    }

    if (data.recipientType) {
      // Select recipient type using the select trigger
      await this.page.click('[data-testid="notification-form-recipient-select"]');
      // Select the option (implementation depends on select component)
    }

    if (data.sendDate) {
      // Date picker is handled via the date picker component
      await this.page.fill('[data-testid="notification-form-date-picker"]', data.sendDate);
    }

    if (data.recurrence) {
      // Select recurrence using the select trigger
      await this.page.click('[data-testid="notification-form-recurrence-select"]');
      // Select the option (implementation depends on select component)
    }

    // Submit the form
    await this.page.click('[data-testid="form-submit-button"]');

    // Wait for success message (toast appears in sonner portal)
    await this.page.locator('text=Notificación creada').waitFor({ state: "visible" });
  }

  async getNotificationCards() {
    // Find notification items by data-testid
    return this.page.locator('[data-testid="notification-item"]');
  }

  async getNotificationByMessage(message: string) {
    // Find notification by message text using data-testid
    return this.page.locator('[data-testid="notification-item"]').filter({
      has: this.page.locator('[data-testid="notification-message"]').filter({ hasText: message })
    }).first();
  }

  async editNotification(message: string, newMessage: string) {
    const notification = await this.getNotificationByMessage(message);
    await notification.locator('[data-testid="notification-menu-button"]').click();
    await this.page.click('[data-testid="notification-edit-option"]');

    await this.page.fill('[data-testid="notification-form-message-input"]', newMessage);
    await this.page.click('[data-testid="form-submit-button"]');

    await this.page.locator('text=Notificación actualizada').waitFor({ state: "visible" });
  }

  async deleteNotification(message: string) {
    // Find the notification by message text using data-testid
    const notification = await this.getNotificationByMessage(message);
    await expect(notification).toBeVisible();
    
    // Get the count of notifications with this message before deletion
    const beforeCount = await this.page.locator('[data-testid="notification-item"]').filter({
      has: this.page.locator('[data-testid="notification-message"]').filter({ hasText: message })
    }).count();
    
    // Click the menu button
    await notification.locator('[data-testid="notification-menu-button"]').click();
    
    // Click delete option
    await this.page.click('[data-testid="notification-delete-option"]');
    
    // Confirm deletion
    await this.page.click('[data-testid="confirm-dialog-confirm-button"]');

    // Wait for confirmation dialog to close
    await expect(this.page.locator('[data-testid="confirm-dialog"]')).not.toBeVisible();

    // Wait for page to refresh/revalidate (revalidatePath was called)
    await this.page.waitForTimeout(1000);

    // Verify the notification count decreased by 1 (more reliable than checking for toast)
    const afterCount = await this.page.locator('[data-testid="notification-item"]').filter({
      has: this.page.locator('[data-testid="notification-message"]').filter({ hasText: message })
    }).count();
    
    expect(afterCount).toBe(beforeCount - 1);
  }

  async sendNotification(message: string) {
    const notification = await this.getNotificationByMessage(message);
    await notification.locator('[data-testid="notification-menu-button"]').click();
    await this.page.click('[data-testid="notification-send-option"]');

    // Wait for success message (dynamic: "Sent to X clients" - toast appears in sonner portal)
    // The message format is "Sent to X clients" or "Sent to X clients, Y failed"
    await this.page.locator('text=/Sent to \\d+ clients/').waitFor({ state: "visible" });
  }

  async searchNotifications(query: string) {
    const searchInput = this.page.locator('[data-testid="notification-search-input"]');
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
