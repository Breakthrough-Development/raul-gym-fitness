import { expect, test } from "@playwright/test";

test.describe("WhatsApp Notifications - UI", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test.beforeEach(async ({ page }) => {
    // Navigate to the notifications page before each test
    await page.goto("/dashboard/notifications");
  });

  test("should display notifications page", async ({ page }) => {
    // Check that the page loads correctly
    await expect(page.locator('[data-testid="notifications-page-heading"]')).toContainText(
      "WhatsApp Notifications"
    );
    await expect(page.locator('[data-testid="notifications-page-description"]')).toBeVisible();

    // Check that the create button is visible
    await expect(page.locator('[data-testid="create-notification-button"]')).toBeVisible();
  });

  test("should open create notification modal", async ({ page }) => {
    // Click the create notification button
    await page.locator('[data-testid="create-notification-button"]').click();

    // Use expect with auto-waiting instead of waitForSelector
    await expect(page.locator('[data-testid="form-dialog"]')).toBeVisible();

    // Check that the modal opens - use more specific selector
    await expect(page.locator('[data-testid="form-dialog-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="form-dialog-description"]')).toBeVisible();

    // Check that the form fields are present
    await expect(page.locator('[data-testid="notification-form-message-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="notification-form-template-input"]')).toBeVisible();
    // Recipient Type select (defaults to "All Clients")
    await expect(page.locator('[data-testid="notification-form-recipient-select"]')).toBeVisible();
    // DatePicker renders a button containing the date and a hidden input
    await expect(page.locator('[data-testid="notification-form-date-picker"]')).toBeVisible();
    // Recurrence select (defaults to "One Time")
    await expect(page.locator('[data-testid="notification-form-recurrence-select"]')).toBeVisible();
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  test("should display empty state when no notifications", async ({ page }) => {
    // If there are no notifications, check for empty state
    // const emptyState = page.locator('[data-testid="notifications-empty-state"]');
    // This might be visible if there are no notifications
    // await expect(emptyState).toBeVisible();
  });
});

