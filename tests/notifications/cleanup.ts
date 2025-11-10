import { Page } from "@playwright/test";
import { NotificationTestUtils } from "../utils";

/**
 * Test message patterns to match for cleanup
 */
export const TEST_PATTERNS = [
  /^Test notification/,
  /^Updated notification/,
  /^searchable test notification/,
];

/**
 * Clean up test notifications matching the test patterns
 * Uses the NotificationTestUtils class for simpler, more reliable deletion
 */
export async function cleanupTestNotifications(page: Page) {
  const utils = new NotificationTestUtils(page);
  
  try {
    await page.goto("/dashboard/notifications");
    await page.waitForLoadState("networkidle");

    // Get all notifications
    const allNotifications = utils.getNotificationCards();
    const count = await allNotifications.count();

    if (count === 0) {
      return; // No notifications to clean up
    }

    // Collect all matching notification messages (limit to prevent infinite loops)
    const messagesToDelete: string[] = [];
    const maxIterations = Math.min(count, 50); // Limit to prevent excessive iterations

    for (let i = 0; i < maxIterations; i++) {
      try {
        const notification = allNotifications.nth(i);
        const messageElement = notification.getByTestId("notification-message");

        if ((await messageElement.count()) > 0) {
          const messageText = await messageElement.textContent();

          if (messageText && TEST_PATTERNS.some((pattern) => pattern.test(messageText))) {
            messagesToDelete.push(messageText.trim());
          }
        }
      } catch {
        // Continue with next notification
      }
    }

    // Delete all matching notifications (limit deletions to prevent timeout)
    const maxDeletions = 20;
    for (let i = 0; i < Math.min(messagesToDelete.length, maxDeletions); i++) {
      const message = messagesToDelete[i];
      try {
        // Check if notification still exists before attempting deletion
        const notification = utils.getNotificationByMessage(message);
        const exists = (await notification.count()) > 0;

        if (exists) {
          await utils.deleteNotification(message);
          // Small delay between deletions to avoid overwhelming the system
          await page.waitForTimeout(200);
        }
      } catch {
        // Continue with next notification if deletion fails
      }
    }
  } catch (error) {
    // Silently fail cleanup - don't let cleanup errors break tests
    console.warn("Cleanup failed:", error);
  }
}

