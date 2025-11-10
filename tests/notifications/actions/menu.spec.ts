import { expect, test } from "@playwright/test";
import { NotificationTestUtils } from "../../utils";

test.describe("WhatsApp Notifications - Actions - Menu", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/notifications");
  });

  test("should open notification menu", async ({ page }) => {
    const utils = new NotificationTestUtils(page);
    const notificationMessage = `Test notification menu ${Date.now()}`;

    await test.step("Create a notification", async () => {
      await utils.createNotification({ message: notificationMessage });
    });

    await test.step("Open the notification menu", async () => {
      const notification = utils.getNotificationByMessage(notificationMessage);
      await utils.openNotificationMenu(notification);
    });

    await test.step("Verify menu is visible", async () => {
      await expect(
        page.locator('[data-slot="dropdown-menu-content"]')
      ).toBeVisible();
    });
  });

  test("should display edit option in menu", async ({ page }) => {
    const utils = new NotificationTestUtils(page);
    const notificationMessage = `Test notification edit option ${Date.now()}`;

    await test.step("Create a notification", async () => {
      await utils.createNotification({ message: notificationMessage });
    });

    await test.step("Open menu and verify edit option", async () => {
      const notification = utils.getNotificationByMessage(notificationMessage);
      await utils.openNotificationMenu(notification);
      await expect(
        page.getByTestId("notification-edit-option")
      ).toBeVisible();
    });
  });

  test("should display delete option in menu", async ({ page }) => {
    const utils = new NotificationTestUtils(page);
    const notificationMessage = `Test notification delete option ${Date.now()}`;

    await test.step("Create a notification", async () => {
      await utils.createNotification({ message: notificationMessage });
    });

    await test.step("Open menu and verify delete option", async () => {
      const notification = utils.getNotificationByMessage(notificationMessage);
      await utils.openNotificationMenu(notification);
      await expect(
        page.getByTestId("notification-delete-option")
      ).toBeVisible();
    });
  });

  test("should display all menu options", async ({ page }) => {
    const utils = new NotificationTestUtils(page);
    const notificationMessage = `Test notification all options ${Date.now()}`;

    await test.step("Create a notification", async () => {
      await utils.createNotification({ message: notificationMessage });
    });

    await test.step("Open menu and verify all options", async () => {
      const notification = utils.getNotificationByMessage(notificationMessage);
      await utils.openNotificationMenu(notification);
      
      await expect(
        page.getByTestId("notification-edit-option")
      ).toBeVisible();
      await expect(
        page.getByTestId("notification-delete-option")
      ).toBeVisible();
    });
  });
});

