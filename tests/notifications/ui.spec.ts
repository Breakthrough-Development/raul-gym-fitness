import { expect, test } from "@playwright/test";
import { NotificationTestUtils } from "../utils";

test.describe("WhatsApp Notifications - UI", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/notifications");
  });

  test("should display notifications page", async ({ page }) => {
    // Check that the page loads correctly using data-testid (more specific)
    await expect(page.getByTestId("notifications-page-heading")).toContainText(
      "WhatsApp Notifications"
    );
    await expect(page.getByTestId("notifications-page-description")).toBeVisible();

    // Check that the create button is visible
    await expect(page.getByTestId("create-notification-button")).toBeVisible();
  });

  test("should open create notification modal", async ({ page }) => {
    const utils = new NotificationTestUtils(page);

    // Open the modal using utility method
    await utils.openCreateModal();

    // Check that the modal opens with all required elements
    await expect(page.getByTestId("form-dialog-title")).toBeVisible();
    await expect(page.getByTestId("form-dialog-description")).toBeVisible();

    // Check that the form fields are present
    await expect(page.getByTestId("notification-form-message-input")).toBeVisible();
    await expect(page.getByTestId("notification-form-template-input")).toBeVisible();
    await expect(page.getByTestId("notification-form-recipient-select")).toBeVisible();
    await expect(page.getByTestId("notification-form-date-picker")).toBeVisible();
    await expect(page.getByTestId("notification-form-recurrence-select")).toBeVisible();
  });

  test("should display empty state when no notifications", async ({ page }) => {
    // Check if empty state is visible when there are no notifications
    const notifications = page.getByTestId("notification-item");
    const count = await notifications.count();

    if (count === 0) {
      await expect(page.getByTestId("notifications-empty-state")).toBeVisible();
    }
  });
});

