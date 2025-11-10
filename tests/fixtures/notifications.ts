/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from "@playwright/test";
import { NotificationTestUtils } from "../utils";

type NotificationFixtures = {
  notification: string;
  notificationWithMessage: string;
};

export const test = base.extend<NotificationFixtures>({
  /**
   * Fixture that creates a notification with a unique message.
   * Automatically cleans up after each test.
   */
  notification: async ({ page }, use) => {
    const utils = new NotificationTestUtils(page);
    const message = `Test notification ${Date.now()}`;

    // Navigate to notifications page if not already there
    await page.goto("/dashboard/notifications");

    // Create the notification
    await utils.createNotification({ message });

    // Provide the message to the test
    await use(message);

    // Cleanup after test
    try {
      await page.goto("/dashboard/notifications");
      const notification = utils.getNotificationByMessage(message);
      const exists = (await notification.count()) > 0;
      if (exists) {
        await utils.deleteNotification(message).catch(() => {
          // Silently fail if deletion fails
        });
      }
    } catch (error) {
      // Silently fail cleanup - don't let cleanup errors break tests
      console.warn("Fixture cleanup failed:", error);
    }
  },

  /**
   * Fixture that creates a notification with a custom message.
   * Automatically cleans up after each test.
   */
  notificationWithMessage: async ({ page }, use, testInfo) => {
    const utils = new NotificationTestUtils(page);
    // Use test title to make message unique per test
    const message = `Test ${testInfo.title} ${Date.now()}`;

    // Navigate to notifications page if not already there
    await page.goto("/dashboard/notifications");

    // Create the notification
    await utils.createNotification({ message });

    // Provide the message to the test
    await use(message);

    // Cleanup after test
    try {
      await page.goto("/dashboard/notifications");
      const notification = utils.getNotificationByMessage(message);
      const exists = (await notification.count()) > 0;
      if (exists) {
        await utils.deleteNotification(message).catch(() => {
          // Silently fail if deletion fails
        });
      }
    } catch (error) {
      // Silently fail cleanup - don't let cleanup errors break tests
      console.warn("Fixture cleanup failed:", error);
    }
  },
});

