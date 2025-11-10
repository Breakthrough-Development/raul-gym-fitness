import { expect, test } from "@playwright/test";
import { NotificationTestUtils } from "../../utils";

test.describe("WhatsApp Notifications - Create", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/notifications");
  });

  test("should create a notification", async ({ page }) => {
    const utils = new NotificationTestUtils(page);
    const uniqueMessage = `Test notification create ${Date.now()}`;
    
    await test.step("Create notification", async () => {
      await utils.createNotification({ message: uniqueMessage });
    });

    await test.step("Verify notification appears in list", async () => {
      await expect(
        page
          .getByTestId("notification-item")
          .filter({ hasText: uniqueMessage })
          .first()
      ).toBeVisible();
    });
  });

  test("should create notification with custom template", async ({ page }) => {
    const utils = new NotificationTestUtils(page);
    const uniqueMessage = `Test notification template ${Date.now()}`;
    const templateName = "custom_template";

    await test.step("Create notification with custom template", async () => {
      await utils.createNotification({
        message: uniqueMessage,
        templateName,
      });
    });

    await test.step("Verify notification appears in list", async () => {
      await expect(
        page
          .getByTestId("notification-item")
          .filter({ hasText: uniqueMessage })
          .first()
      ).toBeVisible();
    });
  });
});

