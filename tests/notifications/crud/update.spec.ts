import { expect, test } from "@playwright/test";
import { NotificationTestUtils } from "../../utils";

test.describe("WhatsApp Notifications - Update", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/notifications");
  });

  test("should edit notification", async ({ page }) => {
    const utils = new NotificationTestUtils(page);
    const originalMessage = `Test notification edit ${Date.now()}`;
    const updatedMessage = `Updated notification edit ${Date.now()}`;

    await test.step("Create a notification", async () => {
      await utils.createNotification({ message: originalMessage });
    });

    await test.step("Edit the notification", async () => {
      await utils.editNotification(originalMessage, updatedMessage);
    });

    await test.step("Verify updated notification appears", async () => {
      await expect(
        page
          .getByTestId("notification-item")
          .filter({ hasText: updatedMessage })
          .first()
      ).toBeVisible();
      // Verify original is gone
      await expect(
        page
          .getByTestId("notification-item")
          .filter({ hasText: originalMessage })
      ).toHaveCount(0);
    });
  });

  test("should update notification message", async ({ page }) => {
    const utils = new NotificationTestUtils(page);
    const originalMessage = `Test notification update ${Date.now()}`;
    const updatedMessage = `Updated message ${Date.now()}`;

    await test.step("Create and edit notification", async () => {
      await utils.createNotification({ message: originalMessage });
      await utils.editNotification(originalMessage, updatedMessage);
    });

    await test.step("Verify updated message appears", async () => {
      await expect(
        page
          .getByTestId("notification-item")
          .filter({ hasText: updatedMessage })
          .first()
      ).toBeVisible();
    });
  });
});

