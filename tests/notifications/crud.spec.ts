import { test } from "@playwright/test";
import { NotificationTestUtils } from "../utils";
import { cleanupTestNotifications } from "./cleanup";

test.describe("WhatsApp Notifications - CRUD", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/notifications");
  });

  test("should create a notification", async ({ page }) => {
    const utils = new NotificationTestUtils(page);
    const uniqueMessage = `Test notification create ${Date.now()}`;
    await utils.createNotification({ message: uniqueMessage });
  });

  test("should edit notification", async ({ page }) => {
    const utils = new NotificationTestUtils(page);
    const originalMessage = `Test notification edit ${Date.now()}`;

    // Create a notification for this test
    await utils.createNotification({ message: originalMessage });

    // Edit the notification using utility method
    const updatedMessage = `Updated notification edit ${Date.now()}`;
    await utils.editNotification(originalMessage, updatedMessage);
  });

  test("should delete notification", async ({ page }) => {
    const utils = new NotificationTestUtils(page);
    const notificationMessage = `Test notification delete ${Date.now()}`;

    // Create a notification for this test
    await utils.createNotification({ message: notificationMessage });

    // Delete the notification using utility method
    await utils.deleteNotification(notificationMessage);
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

