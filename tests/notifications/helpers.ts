import { Page } from "@playwright/test";
import { NotificationTestUtils } from "../utils";

/**
 * Helper function to create a notification with unique identifier
 * Uses the enhanced NotificationTestUtils class
 */
export async function createNotification(
  page: Page,
  message: string,
  templateName = "test_template"
) {
  const utils = new NotificationTestUtils(page);
  await utils.createNotification({
    message,
    templateName,
  });
  return message;
}

/**
 * Find a notification by its message text
 * Uses the enhanced NotificationTestUtils class
 */
export function findNotificationByMessage(page: Page, message: string) {
  const utils = new NotificationTestUtils(page);
  return utils.getNotificationByMessage(message);
}

