import { expect, test } from "@playwright/test";
import { createNotification, findNotificationByMessage } from "./helpers";
import { cleanupTestNotifications } from "./cleanup";

test.describe("WhatsApp Notifications - Actions", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test.beforeEach(async ({ page }) => {
    // Navigate to the notifications page before each test
    await page.goto("/dashboard/notifications");
  });

  test("should search notifications", async ({ page }) => {
    // Create a notification with searchable text for this test
    const searchableText = `searchable test notification ${Date.now()}`;
    await createNotification(page, searchableText);

    // Look for search input
    const searchInput = page.locator('[data-testid="notification-search-input"]');
    await expect(searchInput).toBeVisible();

    // Type in search (use part of the message to find it)
    await searchInput.fill("searchable");

    // Wait for search results to load
    await page.waitForTimeout(500);

    // Verify the notification appears in search results
    await expect(
      page
        .locator('[data-testid="notification-item"]')
        .locator('[data-testid="notification-message"]')
        .filter({ hasText: searchableText })
    ).toBeVisible({ timeout: 10000 });
  });

  test("should handle notification actions", async ({ page }) => {
    // Create a notification for this test
    const notificationMessage = `Test notification actions ${Date.now()}`;
    await createNotification(page, notificationMessage);

    // Find the notification we just created
    const notification = findNotificationByMessage(page, notificationMessage);

    // Click on the notification's action menu
    await notification.locator('[data-testid="notification-menu-button"]').click();

    // Check that action menu items are visible
    await expect(page.locator('[data-testid="notification-edit-option"]')).toBeVisible();
    await expect(page.locator('[data-testid="notification-delete-option"]')).toBeVisible();
  });

  test("should send notification immediately", async ({ page }) => {
    // This test assumes there are pending notifications
    const pendingNotifications = page.locator('[data-testid="notification-item"]').filter({
      has: page.locator('[data-testid="notification-status"]').filter({ hasText: /Pending|Pendiente/ }),
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
    const sendOption = page.getByTestId("notification-send-option");
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
    await expect(page.locator('text=/Sent to \\d+ clients/')).toBeVisible({ timeout: 10000 });
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

