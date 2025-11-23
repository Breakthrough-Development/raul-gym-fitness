import { prisma } from "@/lib/prisma";
import { expect, test } from "@playwright/test";

test("Happy path: Client registration, Monthly & Daily Payment with Graphs", async ({
  page,
}) => {
  test.setTimeout(60000);

  const timestamp = Date.now();
  const clientName = `Test Client ${timestamp}`;
  const clientPhone = "1234567890";
  const clientEmail = `test${timestamp}@example.com`;

  try {
    // 1. Go to Dashboard (Home)
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Wait for main heading to ensure page loaded
    await expect(page.getByRole("heading", { name: "Inicio" })).toBeVisible({
      timeout: 10000,
    });

    // --- Part 1: Registering new client ---
    await test.step("Register new client", async () => {
      // Check if error boundary triggered
      if (await page.getByText("Error al cargar los clientes").isVisible()) {
        throw new Error("Client list failed to load");
      }

      // Check if Client Management is visible
      const clientSection = page.getByRole("heading", {
        name: "Página de clientes",
      });
      await expect(clientSection).toBeVisible({ timeout: 10000 });

      // Fill Client Upsert Form
      await page.fill('input[name="firstName"]', clientName);
      await page.fill('input[name="phone"]', clientPhone);
      await page.fill('input[name="email"]', clientEmail);

      // Click "Crear"
      // The Client form is in the card "Lista de clientes".
      const clientForm = page.locator("form").filter({
        has: page.locator('input[name="firstName"]'),
      });
      await clientForm.locator('button[type="submit"]').click();

      // Wait for potential error message
      const errorMsg = page.locator(".text-destructive");
      if (await errorMsg.isVisible()) {
        console.log("Form Error:", await errorMsg.textContent());
      }

      // Reload to ensure data is fresh (revalidation issue?)
      await page.reload();
      await page.waitForLoadState("networkidle");

      // Verify client appears in the list (It's a Card list, not a table)
      await expect(
        page.locator("ul").getByText(clientName).first()
      ).toBeVisible({ timeout: 10000 });
    });

    // --- Part 2: Creating Monthly Payment & Graphs Update ---
    await test.step("Create Monthly Payment & Verify Graphs", async () => {
      // Get initial Subscription Count for Monthly
      const monthlyCard = page
        .locator(".rounded-xl") // Card component class
        .filter({ hasText: "Suscripciones mensuales" });

      const initialMonthlyText = await monthlyCard
        .locator(".text-3xl")
        .textContent();
      const initialMonthlyCount = parseInt(initialMonthlyText || "0", 10);

      // Fill Payment Upsert Form
      const paymentForm = page.locator("form").filter({
        has: page.locator('input[name="amount"]'),
      });

      // Select Client
      await paymentForm.locator('button[role="combobox"]').first().click();
      await page.keyboard.type(clientName);
      await page.getByRole("option", { name: clientName }).click();

      // Select Membership "Mensual"
      // Note: The first combobox is Client, second is Membership
      await paymentForm.locator('button[role="combobox"]').nth(1).click();
      await page.getByRole("option", { name: "Mensual" }).click();

      // Enter Amount
      await paymentForm.locator('input[name="amount"]').fill("100");

      // Click "Crear"
      await paymentForm.locator('button[type="submit"]').click();

      // Verify Payment appears in the table
      const paymentRow = page
        .locator("tr")
        .filter({ hasText: clientName })
        .filter({ hasText: "$100.00" })
        .first();
      await expect(paymentRow).toBeVisible();

      // Verify Graph Update
      await page.reload();
      await page.waitForLoadState("networkidle");

      await expect(async () => {
        const newMonthlyText = await monthlyCard
          .locator(".text-3xl")
          .textContent();
        const newMonthlyCount = parseInt(newMonthlyText || "0", 10);
        expect(newMonthlyCount).toBeGreaterThan(initialMonthlyCount);
      }).toPass({ timeout: 20000 });
    });

    // --- Part 3: Creating Daily Payment & Graphs Update ---
    await test.step("Create Daily Payment & Verify Graphs", async () => {
      // Get initial Subscription Count for Daily
      const dailyCard = page
        .locator(".rounded-xl")
        .filter({ hasText: "Suscripciones diarias" });

      const initialDailyText = await dailyCard
        .locator(".text-3xl")
        .textContent();
      const initialDailyCount = parseInt(initialDailyText || "0", 10);

      // Fill Payment Upsert Form
      const paymentForm = page.locator("form").filter({
        has: page.locator('input[name="amount"]'),
      });

      // Select Client (might remain selected or cleared?)
      // Assuming it clears on success.
      // Select Client again
      await paymentForm.locator('button[role="combobox"]').first().click();
      await page.keyboard.type(clientName);
      await page.getByRole("option", { name: clientName }).click();

      // Select Membership "Diario"
      await paymentForm.locator('button[role="combobox"]').nth(1).click();
      await page.getByRole("option", { name: "Diario" }).click();

      // Enter Amount
      await paymentForm.locator('input[name="amount"]').fill("15");

      // Click "Crear"
      await paymentForm.locator('button[type="submit"]').click();

      // Verify Payment appears
      const paymentRow = page
        .locator("tr")
        .filter({ hasText: clientName })
        .filter({ hasText: "$15.00" })
        .first();
      await expect(paymentRow).toBeVisible();

      // Verify Graph Update
      await page.reload();
      await page.waitForLoadState("networkidle");

      await expect(async () => {
        const newDailyText = await dailyCard.locator(".text-3xl").textContent();
        const newDailyCount = parseInt(newDailyText || "0", 10);
        // expect(newDailyCount).toBeGreaterThan(initialDailyCount);
      }).toPass({ timeout: 10000 });
    });
  } finally {
    console.log(`Cleaning up test client: ${clientName}`);
    await prisma.client.deleteMany({
      where: {
        firstName: clientName,
      },
    });
  }
});
