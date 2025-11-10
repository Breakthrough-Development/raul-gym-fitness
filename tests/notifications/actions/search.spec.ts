import { expect, test } from "@playwright/test";
import { NotificationTestUtils } from "../../utils";

test.describe("WhatsApp Notifications - Actions - Search", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/notifications");
  });

  test("should search notifications", async ({ page }) => {
    const utils = new NotificationTestUtils(page);
    const searchableText = `searchable test notification ${Date.now()}`;

    await test.step("Create a notification with searchable text", async () => {
      await utils.createNotification({ message: searchableText });
    });

    await test.step("Search for notifications", async () => {
      await utils.searchNotifications("searchable");
    });

    await test.step("Verify the notification appears in search results", async () => {
      await expect(
        page
          .getByTestId("notification-item")
          .filter({ hasText: searchableText })
          .first()
      ).toBeVisible();
    });
  });

  test("should filter notifications by search query", async ({ page }) => {
    const utils = new NotificationTestUtils(page);
    const uniqueText = `unique search ${Date.now()}`;

    await test.step("Create a notification", async () => {
      await utils.createNotification({ message: uniqueText });
    });

    await test.step("Search with unique query", async () => {
      await utils.searchNotifications("unique");
    });

    await test.step("Verify only matching notification appears", async () => {
      await expect(
        page
          .getByTestId("notification-item")
          .filter({ hasText: uniqueText })
          .first()
      ).toBeVisible();
    });
  });
});

