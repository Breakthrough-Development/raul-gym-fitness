import { expect, test } from "@playwright/test";
import { NotificationTestUtils } from "../../utils";

test.describe("WhatsApp Notifications - Delete", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/notifications");
  });

  test("should delete notification", async ({ page }) => {
    const utils = new NotificationTestUtils(page);
    const notificationMessage = `Test notification delete ${Date.now()}`;

    await test.step("Create a notification", async () => {
      await utils.createNotification({ message: notificationMessage });
    });

    await test.step("Delete the notification", async () => {
      await utils.deleteNotification(notificationMessage);
    });

    await test.step("Verify notification is removed", async () => {
      await expect(
        page
          .getByTestId("notification-item")
          .filter({ hasText: notificationMessage })
      ).toHaveCount(0);
    });
  });
});

