import { expect, test } from "@playwright/test";
import { NotificationTestUtils } from "../../utils";

test.describe("WhatsApp Notifications - Actions - Send", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/notifications");
  });

  test("should send notification immediately when pending notifications exist", async ({
    page,
  }) => {
    const utils = new NotificationTestUtils(page);

    await test.step("Check for pending notifications", async () => {
      const hasPending = await utils.hasPendingNotifications();
      if (!hasPending) {
        test.skip();
        return;
      }
    });

    const pendingNotifications = utils.findPendingNotifications();
    const firstCard = pendingNotifications.first();
    await expect(firstCard).toBeVisible();

    await test.step("Open menu and send notification", async () => {
      await utils.openNotificationMenu(firstCard);

      const sendOption = page.getByTestId("notification-send-option");
      const sendOptionCount = await sendOption.count();

      if (sendOptionCount === 0) {
        test.skip();
        return;
      }

      await sendOption.first().click();
    });

    await test.step("Verify success message appears", async () => {
      await expect(
        page.getByText(/Sent to \d+ clients/i)
      ).toBeVisible();
    });
  });

  test("should skip when no pending notifications", async ({ page }) => {
    const utils = new NotificationTestUtils(page);

    const hasPending = await utils.hasPendingNotifications();
    if (!hasPending) {
      test.skip();
    }
  });
});

