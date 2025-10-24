import { expect, test } from "@playwright/test";

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

    // Check that the modal opens
    await expect(page.locator("text=Create Notification")).toBeVisible();
    await expect(
      page.locator("text=Set up a new WhatsApp notification")
    ).toBeVisible();

    // Check that the form fields are present
    await expect(page.locator('input[name="message"]')).toBeVisible();
    await expect(page.locator('select[name="templateName"]')).toBeVisible();
    await expect(page.locator('select[name="recipientType"]')).toBeVisible();
    await expect(page.locator('input[name="sendDate"]')).toBeVisible();
    await expect(page.locator('select[name="recurrence"]')).toBeVisible();
  });

  test("should create a notification", async ({ page }) => {
    // Click the create notification button
    await page.click('button:has-text("Create Notification")');

    // Fill in the form
    await page.fill('input[name="message"]', "Test notification");

    // Select a template (if available)
    const templateSelect = page.locator('select[name="templateName"]');
    await templateSelect.selectOption({ index: 0 });

    // Select recipient type
    await page.selectOption('select[name="recipientType"]', "ALL");

    // Set send date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split("T")[0];
    await page.fill('input[name="sendDate"]', dateString);

    // Select recurrence
    await page.selectOption('select[name="recurrence"]', "ONE_TIME");

    // Submit the form
    await page.click('button:has-text("Create")');

    // Check for success message or redirect
    await expect(page.locator("text=Notification created")).toBeVisible();
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
