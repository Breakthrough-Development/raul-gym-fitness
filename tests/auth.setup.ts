import { expect, test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  // Perform authentication steps. Replace these with your actual login steps.
  await page.goto("/sign-in");

  // Fill in the login form with seed credentials
  // TODO: Replace with actual seed credentials
  await page.fill('input[name="usuario"]', "admin"); // Replace with actual seed username
  await page.fill('input[name="password"]', "password123"); // Replace with actual seed password

  // Submit the form
  await page.click('button[type="submit"]');

  // Wait until the page receives the cookies.
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL("/dashboard");

  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  await expect(page.locator("text=Dashboard")).toBeVisible();

  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});
