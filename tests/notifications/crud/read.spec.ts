import { expect, test } from "@playwright/test";
import { NotificationTestUtils } from "../../utils";

test.describe("WhatsApp Notifications - Read", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/notifications");
  });

  test("should display notifications list", async ({ page }) => {
    const utils = new NotificationTestUtils(page);
    
    await test.step("Verify notifications page loads", async () => {
      await expect(
        page.getByTestId("notifications-page-heading")
      ).toContainText("WhatsApp Notifications");
      await expect(
        page.getByTestId("notifications-page-description")
      ).toBeVisible();
    });

    await test.step("Verify notifications are displayed", async () => {
      const notifications = utils.getNotificationCards();
      const count = await notifications.count();
      
      if (count > 0) {
        await expect(notifications.first()).toBeVisible();
      }
    });
  });

  test("should display notification details", async ({ page }) => {
    const utils = new NotificationTestUtils(page);
    const uniqueMessage = `Test notification read ${Date.now()}`;

    await test.step("Create a notification", async () => {
      await utils.createNotification({ message: uniqueMessage });
    });

    await test.step("Verify notification details are visible", async () => {
      const notification = utils.getNotificationByMessage(uniqueMessage);
      await expect(notification).toBeVisible();
      await expect(
        notification.getByTestId("notification-message")
      ).toContainText(uniqueMessage);
    });
  });
});

