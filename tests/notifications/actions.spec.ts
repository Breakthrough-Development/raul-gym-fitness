import { expect, test } from "@playwright/test";
import { NotificationTestUtils } from "../utils";
import { cleanupTestNotifications } from "./cleanup";

test.describe("WhatsApp Notifications - Actions", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/notifications");
  });

  test("should search notifications", async ({ page }) => {
    const utils = new NotificationTestUtils(page);
    const searchableText = `searchable test notification ${Date.now()}`;

    // Create a notification with searchable text
    await utils.createNotification({ message: searchableText });

    // Search for notifications using utility method
    await utils.searchNotifications("searchable");

    // Verify the notification appears in search results
    await expect(
      page
        .getByTestId("notification-item")
        .filter({
          has: page
            .getByTestId("notification-message")
            .filter({ hasText: searchableText }),
        })
        .first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("should handle notification actions", async ({ page }) => {
    const utils = new NotificationTestUtils(page);
    const notificationMessage = `Test notification actions ${Date.now()}`;

    // Create a notification for this test
    await utils.createNotification({ message: notificationMessage });

    // Get the notification and open its menu
    const notification = utils.getNotificationByMessage(notificationMessage);
    await utils.openNotificationMenu(notification);

    // Check that action menu items are visible
    await expect(page.getByTestId("notification-edit-option")).toBeVisible();
    await expect(page.getByTestId("notification-delete-option")).toBeVisible();
  });

  test("should send notification immediately", async ({ page }) => {
    const utils = new NotificationTestUtils(page);

    // Find pending notifications
    const pendingNotifications = page
      .getByTestId("notification-item")
      .filter({
        has: page
          .getByTestId("notification-status")
          .filter({ hasText: /Pending|Pendiente/ }),
      });

    const pendingCount = await pendingNotifications.count();
    if (pendingCount === 0) {
      test.skip();
      return;
    }

    // Get the first pending notification
    const firstCard = pendingNotifications.first();
    await expect(firstCard).toBeVisible();

    // Open the menu directly on this notification
    await utils.openNotificationMenu(firstCard);

    // Check if send option is available
    const sendOption = page.getByTestId("notification-send-option");
    const sendOptionCount = await sendOption.count();

    if (sendOptionCount === 0) {
      test.skip();
      return;
    }

    // Click send option
    await sendOption.first().click();

    // Wait for success message (dynamic: "Sent to X clients")
    await expect(page.getByText(/Sent to \d+ clients/i)).toBeVisible({
      timeout: 10000,
    });
  });

  test.afterAll(async ({ browser }) => {
    // Clean up test notifications created during the test suite
    const context = await browser.newContext({
      storageState: "playwright/.auth/user.json",
    });
    const page = await context.newPage();

    try {
      await cleanupTestNotifications(page);
    } finally {
      await context.close();
    }
  });
});

