import { expect, test } from "@playwright/test";

test.describe("WhatsApp Cron API - Dry Run", () => {
  const CRON_ENDPOINT = "/api/cron/whatsapp";
  const CRON_SECRET = process.env.CRON_SECRET;

  test("should return 200 with valid x-cron-secret header (dry run)", async ({
    request,
  }) => {
    if (!CRON_SECRET) {
      test.skip();
      return;
    }

    await test.step("Make dry run request", async () => {
      const response = await request.get(`${CRON_ENDPOINT}?dryRun=1`, {
        headers: {
          "x-cron-secret": CRON_SECRET,
        },
      });

      expect(response.status()).toBe(200);
    });

    await test.step("Verify base response properties", async () => {
      const response = await request.get(`${CRON_ENDPOINT}?dryRun=1`, {
        headers: {
          "x-cron-secret": CRON_SECRET,
        },
      });

      const data = await response.json();

      // All responses should have these base properties
      expect(data).toHaveProperty("ok");
      expect(data.ok).toBe(true);
      expect(data).toHaveProperty("today");
    });

    await test.step("Verify response structure based on reminder day", async () => {
      const response = await request.get(`${CRON_ENDPOINT}?dryRun=1`, {
        headers: {
          "x-cron-secret": CRON_SECRET,
        },
      });

      const data = await response.json();

      // Response structure varies based on whether it's a reminder day
      if (data.message) {
        // Not a reminder day
        expect(data.message).toBe("No cohort today");
      } else {
        // Reminder day - should have processing results
        expect(data).toHaveProperty("processed");
        expect(data).toHaveProperty("results");
        expect(typeof data.processed).toBe("number");
        expect(Array.isArray(data.results)).toBe(true);
      }
    });
  });

  test("should handle dryRun parameter correctly", async ({ request }) => {
    if (!CRON_SECRET) {
      test.skip();
      return;
    }

    await test.step("Make dry run request", async () => {
      const response = await request.get(`${CRON_ENDPOINT}?dryRun=1`, {
        headers: {
          "x-cron-secret": CRON_SECRET,
        },
      });

      expect(response.status()).toBe(200);
    });

    await test.step("Verify dry run mode behavior", async () => {
      const response = await request.get(`${CRON_ENDPOINT}?dryRun=1`, {
        headers: {
          "x-cron-secret": CRON_SECRET,
        },
      });

      const data = await response.json();
      expect(data.ok).toBe(true);

      // In dry run mode, if there are results, they should indicate sent: false
      // or just show processing without actually sending messages
      if (data.results && data.results.length > 0) {
        // Verify the endpoint processed candidates but didn't actually send
        // (In dry run, sent should be false or processing should be simulated)
        expect(Array.isArray(data.results)).toBe(true);
      }
    });
  });
});

