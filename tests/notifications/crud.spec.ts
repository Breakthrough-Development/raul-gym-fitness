import { expect, test } from "@playwright/test";
import { createNotification, findNotificationByMessage } from "./helpers";
import { cleanupTestNotifications } from "./cleanup";

test.describe("WhatsApp Notifications - CRUD", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test.beforeEach(async ({ page }) => {
    // Navigate to the notifications page before each test
    await page.goto("/dashboard/notifications");
  });

  test("should create a notification", async ({ page }) => {
    const uniqueMessage = `Test notification create ${Date.now()}`;
    await createNotification(page, uniqueMessage);
  });

  test("should edit notification", async ({ page }) => {
    // Create a notification for this test
    const originalMessage = `Test notification edit ${Date.now()}`;
    await createNotification(page, originalMessage);

    // Find the notification we just created
    const notification = findNotificationByMessage(page, originalMessage);

    // Click on the notification's action menu
    await notification.locator('[data-testid="notification-menu-button"]').click();

    // Click edit
    await page.click('[data-testid="notification-edit-option"]');

    // Check that edit modal opens
    await expect(page.locator('[data-testid="form-dialog-title"]')).toBeVisible();

    // Modify the message
    const updatedMessage = `Updated notification edit ${Date.now()}`;
    await page.fill('[data-testid="notification-form-message-input"]', updatedMessage);

    // Submit the form
    await page.click('[data-testid="form-submit-button"]');

    // Wait a moment for form submission
    await page.waitForTimeout(500);

    // Close the modal manually (it doesn't close automatically)
    await page.keyboard.press("Escape");

    // Wait for modal to close
    await expect(page.locator('[data-testid="form-dialog"]')).not.toBeVisible({ timeout: 10000 });

    // Wait for page to refresh/revalidate
    await page.waitForTimeout(1000);

    // Verify the notification was updated by checking the new message appears
    await expect(
      page
        .locator('[data-testid="notification-item"]')
        .locator('[data-testid="notification-message"]')
        .filter({ hasText: updatedMessage })
    ).toBeVisible({ timeout: 10000 });
  });

  test("should delete notification", async ({ page }) => {
    // Create a notification for this test
    const notificationMessage = `Test notification delete ${Date.now()}`;
    await createNotification(page, notificationMessage);

    // Find the notification we just created
    const notification = findNotificationByMessage(page, notificationMessage);

    // Click on the notification's action menu
    await notification.locator('[data-testid="notification-menu-button"]').click();

    // Click delete
    await page.click('[data-testid="notification-delete-option"]');

    // Confirm deletion in the confirmation dialog
    await page.click('[data-testid="confirm-dialog-confirm-button"]');

    // Wait for confirmation dialog to close
    await expect(page.locator('[data-testid="confirm-dialog"]')).not.toBeVisible();

    // Wait for page to refresh/revalidate
    await page.waitForTimeout(1000);

    // Verify the notification is deleted by checking it's no longer in the list
    const deletedNotification = page.locator('[data-testid="notification-item"]').filter({
      has: page.locator('[data-testid="notification-message"]').filter({ hasText: notificationMessage }),
    });
    await expect(deletedNotification).toHaveCount(0, { timeout: 10000 });
  });

  test.afterAll(async ({ browser }) => {
    // Clean up test notifications created during the test suite
    const context = await browser.newContext({
      storageState: "playwright/.auth/user.json",
    });
    const page = await context.newPage();

    try {
      await cleanupTestNotifications(page);
    } finally {
      await context.close();
    }
  });
});

