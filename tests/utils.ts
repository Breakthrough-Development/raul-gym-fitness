import { expect, Page } from "@playwright/test";
import { addDays, format } from "date-fns";

export class NotificationTestUtils {
  constructor(private page: Page) {}

  /**
   * Wait for toast message to appear (supports both English and Spanish)
   */
  private async waitForToast(message: string | RegExp, timeout = 10000) {
    const toastLocator =
      typeof message === "string"
        ? this.page.getByText(message)
        : this.page.locator(`text=${message}`);
    await expect(toastLocator).toBeVisible({ timeout });
  }

  /**
   * Open the create notification modal
   */
  async openCreateModal() {
    await this.page.getByTestId("create-notification-button").click();
    await expect(this.page.getByTestId("form-dialog")).toBeVisible();
  }

  /**
   * Select a date in the date picker
   */
  async selectDate(date: Date) {
    const dateButton = this.page.getByTestId("notification-form-date-picker");
    await dateButton.click();

    // Wait for calendar to be visible (the calendar has data-slot="calendar")
    const calendar = this.page.locator('[data-slot="calendar"]');
    await expect(calendar).toBeVisible();

    // Format date as it appears in data-day attribute (matches calendar component format)
    // Calendar uses day.date.toLocaleDateString() which defaults to system locale
    // Use en-US to match the original test format: "M/D/YYYY"
    const dataDay = date.toLocaleDateString("en-US");
    const dayButton = this.page.locator(`button[data-day="${dataDay}"]`);

    // Wait for the day button to be visible and clickable
    await expect(dayButton).toBeVisible();
    await dayButton.click();

    // Wait for calendar popover to close (date picker closes automatically on selection)
    // The calendar is inside a Radix PopoverContent which closes when date is selected
    await expect(calendar).not.toBeVisible({ timeout: 5000 });
  }

  /**
   * Fill the notification form
   */
  async fillForm(data: {
    message: string;
    templateName?: string;
    sendDate?: Date;
  }) {
    if (data.message) {
      await this.page
        .getByTestId("notification-form-message-input")
        .fill(data.message);
    }

    if (data.templateName) {
      await this.page
        .getByTestId("notification-form-template-input")
        .fill(data.templateName);
    }

    if (data.sendDate) {
      await this.selectDate(data.sendDate);
    }
  }

  /**
   * Submit the form and wait for success
   */
  async submitForm(expectCreated = true) {
    await this.page.getByTestId("form-submit-button").click();

    // Wait for success toast (supports both languages)
    if (expectCreated) {
      await this.waitForToast(/Notificación creada|Notification created/i);
    } else {
      await this.waitForToast(/Notificación actualizada|Notification updated/i);
    }
  }

  /**
   * Close the form dialog
   */
  async closeDialog() {
    // Wait for dialog to be visible first
    const dialog = this.page.getByTestId("form-dialog");
    await expect(dialog).toBeVisible();

    // Press Escape to close
    await this.page.keyboard.press("Escape");

    // Wait for dialog to close
    await expect(dialog).not.toBeVisible();
  }

  /**
   * Create a notification with default values
   */
  async createNotification(data: {
    message: string;
    templateName?: string;
    sendDate?: Date;
  }) {
    await this.openCreateModal();

    const sendDate = data.sendDate ?? addDays(new Date(), 1);
    await this.fillForm({
      message: data.message,
      templateName: data.templateName ?? "test_template",
      sendDate,
    });

    await this.submitForm();
    await this.closeDialog();

    // Wait for notification to appear in list (wait for network to be idle)
    await this.page.waitForLoadState("networkidle");
    await expect(
      this.page
        .getByTestId("notification-item")
        .filter({
          has: this.page
            .getByTestId("notification-message")
            .filter({ hasText: data.message }),
        })
        .first()
    ).toBeVisible({ timeout: 10000 });
  }

  /**
   * Get all notification cards
   */
  getNotificationCards() {
    return this.page.getByTestId("notification-item");
  }

  /**
   * Find a notification by its message text
   */
  getNotificationByMessage(message: string) {
    return this.page
      .getByTestId("notification-item")
      .filter({
        has: this.page
          .getByTestId("notification-message")
          .filter({ hasText: message }),
      })
      .first();
  }

  /**
   * Open the action menu for a notification
   */
  async openNotificationMenu(notification: ReturnType<typeof this.getNotificationByMessage>) {
    await notification.getByTestId("notification-menu-button").click();
    // Wait for dropdown menu to be visible
    await expect(
      this.page.locator('[data-slot="dropdown-menu"]')
    ).toBeVisible();
  }

  /**
   * Edit a notification
   */
  async editNotification(message: string, newMessage: string) {
    const notification = this.getNotificationByMessage(message);
    await expect(notification).toBeVisible();

    await this.openNotificationMenu(notification);
    await this.page.getByTestId("notification-edit-option").click();

    // Wait for edit modal to open
    await expect(this.page.getByTestId("form-dialog-title")).toBeVisible();

    // Update the message
    await this.page
      .getByTestId("notification-form-message-input")
      .fill(newMessage);

    await this.submitForm(false);
    await this.closeDialog();

    // Wait for updated notification to appear
    await this.page.waitForLoadState("networkidle");
    await expect(
      this.page
        .getByTestId("notification-item")
        .filter({
          has: this.page
            .getByTestId("notification-message")
            .filter({ hasText: newMessage }),
        })
        .first()
    ).toBeVisible({ timeout: 10000 });
  }

  /**
   * Delete a notification
   */
  async deleteNotification(message: string) {
    const notification = this.getNotificationByMessage(message);
    await expect(notification).toBeVisible();

    // Get count before deletion
    const beforeCount = await this.page
      .getByTestId("notification-item")
      .filter({
        has: this.page
          .getByTestId("notification-message")
          .filter({ hasText: message }),
      })
      .count();

    await this.openNotificationMenu(notification);
    await this.page.getByTestId("notification-delete-option").click();

    // Wait for confirmation dialog
    const confirmDialog = this.page.getByTestId("confirm-dialog");
    await expect(confirmDialog).toBeVisible();

    // Confirm deletion
    await this.page.getByTestId("confirm-dialog-confirm-button").click();

    // Wait for confirmation dialog to close
    await expect(confirmDialog).not.toBeVisible();

    // Wait for network to be idle (revalidatePath was called)
    await this.page.waitForLoadState("networkidle");

    // Verify the notification count decreased
    const afterCount = await this.page
      .getByTestId("notification-item")
      .filter({
        has: this.page
          .getByTestId("notification-message")
          .filter({ hasText: message }),
      })
      .count();

    expect(afterCount).toBe(beforeCount - 1);
  }

  /**
   * Send a notification immediately
   */
  async sendNotification(message: string) {
    const notification = this.getNotificationByMessage(message);
    await expect(notification).toBeVisible();

    await this.openNotificationMenu(notification);

    // Check if send option is available
    const sendOption = this.page.getByTestId("notification-send-option");
    const count = await sendOption.count();

    if (count === 0) {
      throw new Error("Send option not available for this notification");
    }

    await sendOption.first().click();

    // Wait for success message (dynamic: "Sent to X clients")
    await this.waitForToast(/Sent to \d+ clients/i);
  }

  /**
   * Search for notifications
   */
  async searchNotifications(query: string) {
    const searchInput = this.page.getByTestId("notification-search-input");
    await searchInput.fill(query);

    // Wait for search to complete (wait for network idle or debounce)
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Get tomorrow's date
   */
  getTomorrowDate(): Date {
    return addDays(new Date(), 1);
  }

  /**
   * Get a date string in ISO format (YYYY-MM-DD)
   */
  getDateString(date: Date): string {
    return format(date, "yyyy-MM-dd");
  }
}
