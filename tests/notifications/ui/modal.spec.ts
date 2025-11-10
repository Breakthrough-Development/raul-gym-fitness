import { expect, test } from "@playwright/test";
import { NotificationTestUtils } from "../../utils";

test.describe("WhatsApp Notifications - UI - Modal", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/notifications");
  });

  test.describe("Create Modal", () => {
    test("should open create notification modal", async ({ page }) => {
      const utils = new NotificationTestUtils(page);

      await test.step("Open the modal", async () => {
        await utils.openCreateModal();
      });

      await test.step("Verify modal title and description", async () => {
        await expect(page.getByTestId("form-dialog-title")).toBeVisible();
        await expect(page.getByTestId("form-dialog-description")).toBeVisible();
      });

      await test.step("Verify form fields are present", async () => {
        await expect(
          page.getByTestId("notification-form-message-input")
        ).toBeVisible();
        await expect(
          page.getByTestId("notification-form-template-input")
        ).toBeVisible();
        await expect(
          page.getByTestId("notification-form-recipient-select")
        ).toBeVisible();
        await expect(
          page.getByTestId("notification-form-date-picker")
        ).toBeVisible();
        await expect(
          page.getByTestId("notification-form-recurrence-select")
        ).toBeVisible();
      });
    });

    test("should close modal with Escape key", async ({ page }) => {
      const utils = new NotificationTestUtils(page);

      await test.step("Open the modal", async () => {
        await utils.openCreateModal();
      });

      await test.step("Close modal with Escape", async () => {
        await utils.closeDialog();
      });

      await test.step("Verify modal is closed", async () => {
        await expect(page.getByTestId("form-dialog")).not.toBeVisible();
      });
    });
  });
});

