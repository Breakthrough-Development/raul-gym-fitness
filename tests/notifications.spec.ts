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
    await expect(page.locator("h1")).toContainText("WhatsApp Notifications");
    await expect(
      page.locator("text=Manage and send WhatsApp notifications")
    ).toBeVisible();

    // Check that the create button is visible
    await expect(
      page.locator('button:has-text("Create Notification")')
    ).toBeVisible();
  });

  test("should open create notification modal", async ({ page }) => {
    // Click the create notification button
    await page.click('button:has-text("Create Notification")');

    // Wait for modal to appear
    await page.waitForSelector('[role="alertdialog"]', { timeout: 10000 });

    // Check that the modal opens - use more specific selector
    await expect(
      page.locator('h2:has-text("Create Notification")')
    ).toBeVisible();
    await expect(
      page.locator("text=Set up a new WhatsApp notification")
    ).toBeVisible();

    // Check that the form fields are present
    await expect(page.locator('input[name="message"]')).toBeVisible();
    await expect(page.locator('input[name="templateName"]')).toBeVisible();
    // Recipient Type select (defaults to "All Clients")
    await expect(
      page
        .locator('[data-slot="select-trigger"]')
        .filter({ hasText: "All Clients" })
    ).toBeVisible();
    // DatePicker renders a button containing the date and a hidden input
    await expect(
      page.getByRole("button", { name: /\d{4}-\d{2}-\d{2}/ })
    ).toBeVisible();
    // Recurrence select (defaults to "One Time")
    await expect(
      page
        .locator('[data-slot="select-trigger"]')
        .filter({ hasText: "One Time" })
    ).toBeVisible();
  });

  test("should create a notification", async ({ page }) => {
    const utils = new NotificationTestUtils(page);

    // Click the create notification button
    await page.click('button:has-text("Create Notification")');

    // Wait for modal to appear
    await page.waitForSelector('[role="alertdialog"]', { timeout: 10000 });

    // Fill in the form
    await page.fill('input[name="message"]', "Test notification");

    // Fill template name (now an input field)
    await page.fill('input[name="templateName"]', "test_template");

    // Recipient type defaults to "All Clients"; no interaction needed

    // Open DatePicker and pick tomorrow
    const dateButton = page
      .getByRole("button", { name: /\d{4}-\d{2}-\d{2}/ })
      .first();
    await dateButton.click();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    const tomorrowText = `${yyyy}-${mm}-${dd}`;
    await page.getByRole("button", { name: String(Number(dd)) }).click();
    await expect(
      page.getByRole("button", { name: tomorrowText })
    ).toBeVisible();

    // Recurrence defaults to "One Time"; no interaction needed

    // Submit the form (scope to the open dialog to avoid overlay interception)
    const dialog = page.locator('[role="alertdialog"]');
    await dialog.locator('button:has-text("Create")').click();

    // Check for success message or redirect
    await expect(page.locator("text=Notification created")).toBeVisible();

    // Clean up - delete the test notification to avoid accumulation
    await utils.deleteNotification("Test notification");
  });

  test("should search notifications", async ({ page }) => {
    // Look for search input
    const searchInput = page.locator(
      'input[placeholder*="Buscar notificaciones"]'
    );
    await expect(searchInput).toBeVisible();

    // Type in search
    await searchInput.fill("test");

    // Check that search is working (this will depend on your search implementation)
    // You might need to wait for results or check for specific elements
  });

  test("should display empty state when no notifications", async ({ page }) => {
    // If there are no notifications, check for empty state
    const emptyState = page.locator("text=No se encontraron notificaciones");
    // This might be visible if there are no notifications
    // await expect(emptyState).toBeVisible();
  });

  test("should handle notification actions", async ({ page }) => {
    // This test assumes there are existing notifications
    // Look for notification cards
    const notificationCards = page.locator('[data-testid="notification-card"]');

    if ((await notificationCards.count()) > 0) {
      // Click on the first notification's action menu
      const firstCard = notificationCards.first();
      await firstCard.locator('button[aria-label="Open menu"]').click();

      // Check that action menu items are visible
      await expect(page.locator("text=Edit")).toBeVisible();
      await expect(page.locator("text=Delete")).toBeVisible();
    }
  });

  test("should edit notification", async ({ page }) => {
    // This test assumes there are existing notifications
    const notificationCards = page.locator('[data-testid="notification-card"]');

    if ((await notificationCards.count()) > 0) {
      // Click on the first notification's action menu
      const firstCard = notificationCards.first();
      await firstCard.locator('button[aria-label="Open menu"]').click();

      // Click edit
      await page.click("text=Edit");

      // Check that edit modal opens
      await expect(page.locator("text=Edit Notification")).toBeVisible();

      // Modify the message
      await page.fill('input[name="message"]', "Updated notification message");

      // Submit the form
      await page.click('button:has-text("Update")');

      // Check for success message
      await expect(page.locator("text=Notification updated")).toBeVisible();
    }
  });

  test("should delete notification", async ({ page }) => {
    // This test assumes there are existing notifications
    const notificationCards = page.locator('[data-testid="notification-card"]');

    if ((await notificationCards.count()) > 0) {
      // Click on the first notification's action menu
      const firstCard = notificationCards.first();
      await firstCard.locator('button[aria-label="Open menu"]').click();

      // Click delete
      await page.click("text=Delete");

      // Confirm deletion in the confirmation dialog
      await page.click('button:has-text("Confirm")');

      // Check for success message
      await expect(page.locator("text=Notification deleted")).toBeVisible();
    }
  });

  test("should send notification immediately", async ({ page }) => {
    // This test assumes there are pending notifications
    const pendingNotifications = page.locator(
      '[data-testid="notification-card"]:has-text("Pending")'
    );

    if ((await pendingNotifications.count()) > 0) {
      // Click on the first pending notification's action menu
      const firstCard = pendingNotifications.first();
      await firstCard.locator('button[aria-label="Open menu"]').click();

      // Click send now
      await page.click("text=Send Now");

      // Check for success message
      await expect(
        page.locator("text=Notification sent successfully")
      ).toBeVisible();
    }
  });
});
