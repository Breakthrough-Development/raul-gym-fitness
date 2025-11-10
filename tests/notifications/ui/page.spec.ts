import { expect, test } from "@playwright/test";

test.describe("WhatsApp Notifications - UI - Page", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/notifications");
  });

  test.describe("Page Display", () => {
    test("should display notifications page", async ({ page }) => {
      await test.step("Verify page heading", async () => {
        await expect(
          page.getByTestId("notifications-page-heading")
        ).toContainText("WhatsApp Notifications");
      });

      await test.step("Verify page description", async () => {
        await expect(
          page.getByTestId("notifications-page-description")
        ).toBeVisible();
      });

      await test.step("Verify create button is visible", async () => {
        await expect(
          page.getByTestId("create-notification-button")
        ).toBeVisible();
      });
    });
  });

  test.describe("Empty State", () => {
    test("should display empty state when no notifications", async ({ page }) => {
      const notifications = page.getByTestId("notification-item");
      const count = await notifications.count();

      if (count === 0) {
        await expect(
          page.getByTestId("notifications-empty-state")
        ).toBeVisible();
      }
    });
  });
});

