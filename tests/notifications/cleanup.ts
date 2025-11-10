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
 * Has a timeout to prevent hanging
 */
export async function cleanupTestNotifications(page: Page) {
  const utils = new NotificationTestUtils(page);
  const timeout = 20000; // 20 second timeout for cleanup
  const startTime = Date.now();

  try {
    await Promise.race([
      page.goto("/dashboard/notifications"),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Cleanup timeout")), timeout)
      ),
    ]);

    await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {
      // Continue even if networkidle times out
    });

    // Get all notifications
    const allNotifications = utils.getNotificationCards();
    const count = await allNotifications.count();

    if (count === 0) {
      return; // No notifications to clean up
    }

    // Collect all matching notification messages (limit to prevent infinite loops)
    const messagesToDelete: string[] = [];
    const maxIterations = Math.min(count, 20); // Reduced limit

    for (let i = 0; i < maxIterations; i++) {
      // Check timeout
      if (Date.now() - startTime > timeout) {
        break;
      }

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
    const maxDeletions = 10; // Reduced limit
    for (let i = 0; i < Math.min(messagesToDelete.length, maxDeletions); i++) {
      // Check timeout
      if (Date.now() - startTime > timeout) {
        break;
      }

      const message = messagesToDelete[i];
      try {
        // Check if notification still exists before attempting deletion
        const notification = utils.getNotificationByMessage(message);
        const exists = (await notification.count()) > 0;

        if (exists) {
          // Use Promise.race to timeout individual deletions
          await Promise.race([
            utils.deleteNotification(message),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Deletion timeout")), 5000)
            ),
          ]).catch(() => {
            // Continue if deletion times out
          });
        }
      } catch {
        // Continue with next notification if deletion fails
      }
    }
  } catch (error) {
    // Silently fail cleanup - don't let cleanup errors break tests
    // Only log if it's not a timeout (timeouts are expected)
    if (!(error instanceof Error && error.message.includes("timeout"))) {
      console.warn("Cleanup failed:", error);
    }
  }
}

