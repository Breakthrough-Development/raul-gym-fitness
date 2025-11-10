import { expect, Page } from "@playwright/test";

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
 * This is more efficient than the previous implementation - it collects
 * all matching notifications first, then deletes them without reloading
 * after each deletion.
 */
export async function cleanupTestNotifications(page: Page, maxAttempts = 10) {
  await page.goto("/dashboard/notifications");
  await page.waitForTimeout(1000);

  let attempts = 0;
  while (attempts < maxAttempts) {
    // Get all notifications
    const allNotifications = page.locator('[data-testid="notification-item"]');
    const count = await allNotifications.count();

    if (count === 0) {
      break; // No notifications left
    }

    let deletedAny = false;

    // Collect all matching notifications first
    const notificationsToDelete: Array<{ index: number; message: string }> = [];

    for (let i = 0; i < count; i++) {
      try {
        const notification = allNotifications.nth(i);
        const messageElement = notification.locator('[data-testid="notification-message"]');

        if ((await messageElement.count()) > 0) {
          const messageText = await messageElement.textContent();

          if (messageText && TEST_PATTERNS.some((pattern) => pattern.test(messageText))) {
            notificationsToDelete.push({ index: i, message: messageText || "" });
          }
        }
      } catch {
        // Continue with next notification
      }
    }

    // If no matching notifications found, we're done
    if (notificationsToDelete.length === 0) {
      break;
    }

    // Delete notifications (start from the end to preserve indices)
    for (let j = notificationsToDelete.length - 1; j >= 0; j--) {
      try {
        const { index } = notificationsToDelete[j];
        const notification = allNotifications.nth(index);

        // Check if notification still exists
        if ((await notification.count()) > 0) {
          await notification.locator('[data-testid="notification-menu-button"]').click();
          await page.click('[data-testid="notification-delete-option"]');
          await page.click('[data-testid="confirm-dialog-confirm-button"]');
          await expect(page.locator('[data-testid="confirm-dialog"]')).not.toBeVisible({
            timeout: 5000,
          });
          await page.waitForTimeout(300);
          deletedAny = true;
        }
      } catch {
        // Continue with next notification
      }
    }

    // Only reload if we deleted something
    if (deletedAny) {
      await page.reload();
      await page.waitForTimeout(500);
    } else {
      break; // No more deletions possible
    }

    attempts++;
  }
}

