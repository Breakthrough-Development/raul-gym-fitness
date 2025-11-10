import { expect, test } from "@playwright/test";

test.describe("WhatsApp Cron API - Validation", () => {
  const CRON_ENDPOINT = "/api/cron/whatsapp";
  const CRON_SECRET = process.env.CRON_SECRET;

  test("should validate response structure on reminder day", async ({
    request,
  }) => {
    if (!CRON_SECRET) {
      test.skip();
      return;
    }

    await test.step("Make request with valid secret", async () => {
      const response = await request.get(`${CRON_ENDPOINT}?dryRun=1`, {
        headers: {
          "x-cron-secret": CRON_SECRET,
        },
      });

      expect(response.status()).toBe(200);
    });

    await test.step("Validate base response structure", async () => {
      const response = await request.get(`${CRON_ENDPOINT}?dryRun=1`, {
        headers: {
          "x-cron-secret": CRON_SECRET,
        },
      });

      const data = await response.json();

      expect(data).toHaveProperty("ok");
      expect(data).toHaveProperty("today");
      expect(typeof data.ok).toBe("boolean");
      expect(typeof data.today).toBe("string");
    });

    await test.step("Validate processing results if present", async () => {
      const response = await request.get(`${CRON_ENDPOINT}?dryRun=1`, {
        headers: {
          "x-cron-secret": CRON_SECRET,
        },
      });

      const data = await response.json();

      // If it's processing notifications
      if (data.processed !== undefined) {
        expect(typeof data.processed).toBe("number");
        expect(data).toHaveProperty("results");
        expect(Array.isArray(data.results)).toBe(true);

        // Validate result objects if present
        if (data.results.length > 0) {
          const result = data.results[0];
          expect(result).toHaveProperty("id");
          expect(typeof result.id).toBe("string");

          // Should have either sent or skipped flag
          expect(
            result.hasOwnProperty("sent") || result.hasOwnProperty("skipped")
          ).toBe(true);
        }
      }
    });
  });
});

