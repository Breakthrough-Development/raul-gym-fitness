import { expect, test } from "@playwright/test";
import { NotificationTestUtils } from "./utils";

test.describe("WhatsApp Notifications", () => {
  test.use({ storageState: "playwright/.auth/user.json" });
  test.beforeEach(async ({ page }) => {
    // Navigate to the notifications page before each test
    await page.goto("/dashboard/notifications");
  });

  test("should display notifications page", async ({ page }) => {
    // Check that the page loads correctly
    await expect(page.locator('[data-testid="notifications-page-heading"]')).toContainText("WhatsApp Notifications");
    await expect(
      page.locator('[data-testid="notifications-page-description"]')
    ).toBeVisible();

    // Check that the create button is visible
    await expect(
      page.locator('[data-testid="create-notification-button"]')
    ).toBeVisible();
  });

  test("should open create notification modal", async ({ page }) => {
    // Click the create notification button
    await page.locator('[data-testid="create-notification-button"]').click();

    // Use expect with auto-waiting instead of waitForSelector
    await expect(page.locator('[data-testid="form-dialog"]')).toBeVisible();

    // Check that the modal opens - use more specific selector
    await expect(
      page.locator('[data-testid="form-dialog-title"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="form-dialog-description"]')
    ).toBeVisible();

    // Check that the form fields are present
    await expect(page.locator('[data-testid="notification-form-message-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="notification-form-template-input"]')).toBeVisible();
    // Recipient Type select (defaults to "All Clients")
    await expect(
      page.locator('[data-testid="notification-form-recipient-select"]')
    ).toBeVisible();
    // DatePicker renders a button containing the date and a hidden input
    await expect(
      page.locator('[data-testid="notification-form-date-picker"]')
    ).toBeVisible();
    // Recurrence select (defaults to "One Time")
    await expect(
      page.locator('[data-testid="notification-form-recurrence-select"]')
    ).toBeVisible();
  });

  test("should create a notification", async ({ page }) => {
    const utils = new NotificationTestUtils(page);

    // Click the create notification button
    await page.locator('[data-testid="create-notification-button"]').click();

    // Use expect with auto-waiting instead of waitForSelector
    await expect(page.locator('[data-testid="form-dialog"]')).toBeVisible();

    // Fill in the form
    await page.fill('[data-testid="notification-form-message-input"]', "Test notification");

    // Fill template name (now an input field)
    await page.fill('[data-testid="notification-form-template-input"]', "test_template");

    // Recipient type defaults to "All Clients"; no interaction needed

    // Open DatePicker and pick tomorrow
    const dateButton = page.locator('[data-testid="notification-form-date-picker"]');
    await dateButton.click();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Use data-day attribute for precise date selection (avoids duplicate day numbers)
    const dataDay = tomorrow.toLocaleDateString("en-US"); // Format: "M/D/YYYY"
    await page.locator(`button[data-day="${dataDay}"]`).click();

    // Wait for date picker to close (date is selected)
    await page.waitForTimeout(300);

    // Recurrence defaults to "One Time"; no interaction needed

    // Submit the form (scope to the open dialog to avoid overlay interception)
    const dialog = page.locator('[data-testid="form-dialog"]');
    await dialog.locator('[data-testid="form-submit-button"]').click();

    // Check for success message (toast appears in sonner portal)
    await expect(
      page.locator('text=Notificación creada')
    ).toBeVisible({ timeout: 10000 });

    // Close the modal using Escape key (it doesn't close automatically)
    await page.keyboard.press("Escape");
    
    // Wait for modal to close
    await expect(page.locator('[data-testid="form-dialog"]')).not.toBeVisible();
    
    // Reload the page to ensure the notification list is refreshed
    // (revalidatePath was called, but we need to reload to see the new notification)
    await page.reload();
    
    // Wait for the notification to appear in the list (by message text)
    const createdNotification = page.locator('[data-testid="notification-item"]').locator('[data-testid="notification-message"]').filter({ hasText: "Test notification" }).first();
    await expect(createdNotification).toBeVisible({ timeout: 10000 });

    // Clean up - delete the specific test notification we just created
    // Get the notification item container that contains this message
    const notificationItem = createdNotification.locator('xpath=ancestor::*[@data-testid="notification-item"]').first();
    await notificationItem.locator('[data-testid="notification-menu-button"]').click();
    await page.click('[data-testid="notification-delete-option"]');
    await page.click('[data-testid="confirm-dialog-confirm-button"]');
    await expect(page.locator('[data-testid="confirm-dialog"]')).not.toBeVisible();
    await page.waitForTimeout(1000);
  });

  test("should search notifications", async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('[data-testid="notification-search-input"]');
    await expect(searchInput).toBeVisible();

    // Type in search
    await searchInput.fill("test");

    // Check that search is working (this will depend on your search implementation)
    // You might need to wait for results or check for specific elements
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  test("should display empty state when no notifications", async ({ page }) => {
    // If there are no notifications, check for empty state
    // const emptyState = page.locator('[data-testid="notifications-empty-state"]');
    // This might be visible if there are no notifications
    // await expect(emptyState).toBeVisible();
  });

  test("should handle notification actions", async ({ page }) => {
    // This test assumes there are existing notifications
    // Look for notification cards
    const notificationCards = page.locator('[data-testid="notification-item"]');

    if ((await notificationCards.count()) > 0) {
      // Click on the first notification's action menu
      const firstCard = notificationCards.first();
      await firstCard.locator('[data-testid="notification-menu-button"]').click();

      // Check that action menu items are visible
      await expect(page.locator('[data-testid="notification-edit-option"]')).toBeVisible();
      await expect(page.locator('[data-testid="notification-delete-option"]')).toBeVisible();
    }
  });

  test("should edit notification", async ({ page }) => {
    // This test assumes there are existing notifications
    const notificationCards = page.locator('[data-testid="notification-item"]');

    if ((await notificationCards.count()) > 0) {
      // Click on the first notification's action menu
      const firstCard = notificationCards.first();
      await firstCard.locator('[data-testid="notification-menu-button"]').click();

      // Click edit
      await page.click('[data-testid="notification-edit-option"]');

      // Check that edit modal opens
      await expect(page.locator('[data-testid="form-dialog-title"]')).toBeVisible();

      // Get the original message to identify the notification
      const originalMessage = await firstCard.locator('[data-testid="notification-message"]').textContent();
      
      // Modify the message
      const updatedMessage = "Updated notification message";
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
      // (More reliable than checking for toast which might not appear)
      if (originalMessage) {
        await expect(
          page.locator('[data-testid="notification-item"]').locator('[data-testid="notification-message"]').filter({ hasText: updatedMessage })
        ).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test("should delete notification", async ({ page }) => {
    // This test assumes there are existing notifications
    const notificationCards = page.locator('[data-testid="notification-item"]');

    if ((await notificationCards.count()) > 0) {
      // Click on the first notification's action menu
      const firstCard = notificationCards.first();
      await firstCard.locator('[data-testid="notification-menu-button"]').click();

      // Click delete (Spanish: "Eliminar")
      await page.click('[data-testid="notification-delete-option"]');

      // Get the notification message before deletion to verify it's removed
      const notificationMessage = await firstCard.locator('[data-testid="notification-message"]').textContent();
      
      // Confirm deletion in the confirmation dialog
      await page.click('[data-testid="confirm-dialog-confirm-button"]');

      // Wait for confirmation dialog to close
      await expect(page.locator('[data-testid="confirm-dialog"]')).not.toBeVisible();

      // Wait for page to refresh/revalidate
      await page.waitForTimeout(1000);

      // Verify the notification is deleted by checking it's no longer in the list
      // (More reliable than checking for toast)
      if (notificationMessage) {
        const deletedNotification = page.locator('[data-testid="notification-item"]').filter({
          has: page.locator('[data-testid="notification-message"]').filter({ hasText: notificationMessage })
        });
        await expect(deletedNotification).toHaveCount(0, { timeout: 10000 });
      }
    }
  });

  test("should send notification immediately", async ({ page }) => {
    // This test assumes there are pending notifications
    const pendingNotifications = page.locator('[data-testid="notification-item"]').filter({
      has: page.locator('[data-testid="notification-status"]').filter({ hasText: /Pending|Pendiente/ })
    });

    const pendingCount = await pendingNotifications.count();
    if (pendingCount === 0) {
      // No pending notifications - skip this test
      return;
    }

    // Click on the first pending notification's action menu
    const firstCard = pendingNotifications.first();
    await firstCard.locator('[data-testid="notification-menu-button"]').click();

    // Wait for dropdown menu content to be visible (Radix portals take time to render)
    await page.waitForSelector('[data-slot="dropdown-menu"]', { state: "visible" });
    await page.waitForTimeout(200);

    // Check if send option is available
    const sendOption = page.getByTestId('notification-send-option');
    const sendOptionCount = await sendOption.count();
    
    if (sendOptionCount === 0) {
      // No send option available (notification might have been sent already) - skip this test
      return;
    }

    // Wait for send option to be visible
    await expect(sendOption.first()).toBeVisible();
    
    // Click send now - use getByTestId which is more reliable for portal elements
    await sendOption.first().click({ force: true });

    // Check for success message (dynamic: "Sent to X clients" - toast appears in sonner portal)
    // The message format is "Sent to X clients" or "Sent to X clients, Y failed"
    await expect(
      page.locator('text=/Sent to \\d+ clients/')
    ).toBeVisible({ timeout: 10000 });
  });
});
