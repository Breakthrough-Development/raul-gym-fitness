import { expect, Page } from "@playwright/test";

/**
 * Helper function to create a notification with unique identifier
 */
export async function createNotification(
  page: Page,
  message: string,
  templateName = "test_template"
) {
  // Click the create notification button
  await page.locator('[data-testid="create-notification-button"]').click();

  // Wait for dialog to be visible
  await expect(page.locator('[data-testid="form-dialog"]')).toBeVisible();

  // Fill in the form
  await page.fill('[data-testid="notification-form-message-input"]', message);
  await page.fill('[data-testid="notification-form-template-input"]', templateName);

  // Open DatePicker and pick tomorrow
  const dateButton = page.locator('[data-testid="notification-form-date-picker"]');
  await dateButton.click();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Use data-day attribute for precise date selection
  const dataDay = tomorrow.toLocaleDateString("en-US"); // Format: "M/D/YYYY"
  await page.locator(`button[data-day="${dataDay}"]`).click();

  // Wait for date picker to close
  await page.waitForTimeout(300);

  // Submit the form
  const dialog = page.locator('[data-testid="form-dialog"]');
  await dialog.locator('[data-testid="form-submit-button"]').click();

  // Check for success message
  await expect(page.locator('text=Notificación creada')).toBeVisible({ timeout: 10000 });

  // Close the modal
  await page.keyboard.press("Escape");
  await expect(page.locator('[data-testid="form-dialog"]')).not.toBeVisible();

  // Reload the page to ensure the notification list is refreshed
  await page.reload();

  // Wait for the notification to appear in the list
  const createdNotification = page
    .locator('[data-testid="notification-item"]')
    .locator('[data-testid="notification-message"]')
    .filter({ hasText: message })
    .first();
  await expect(createdNotification).toBeVisible({ timeout: 10000 });

  return message;
}

/**
 * Find a notification by its message text
 */
export function findNotificationByMessage(page: Page, message: string) {
  return page
    .locator('[data-testid="notification-item"]')
    .filter({
      has: page.locator('[data-testid="notification-message"]').filter({ hasText: message }),
    })
    .first();
}

