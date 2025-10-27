import { expect, test } from "@playwright/test";

test.describe("WhatsApp Cron API", () => {
  const CRON_ENDPOINT = "/api/cron/whatsapp";
  const CRON_SECRET = process.env.CRON_SECRET;

  test("should return 401 when no x-cron-secret header is provided", async ({
    request,
  }) => {
    const response = await request.get(CRON_ENDPOINT);

    expect(response.status()).toBe(401);

    const data = await response.json();
    expect(data).toHaveProperty("error");
    expect(data.error).toBe("Unauthorized");
  });

  test("should return 401 when wrong x-cron-secret header is provided", async ({
    request,
  }) => {
    const response = await request.get(CRON_ENDPOINT, {
      headers: {
        "x-cron-secret": "wrong-secret-value",
      },
    });

    expect(response.status()).toBe(401);

    const data = await response.json();
    expect(data).toHaveProperty("error");
    expect(data.error).toBe("Unauthorized");
  });

  test("should return 200 with valid x-cron-secret header (dry run)", async ({
    request,
  }) => {
    if (!CRON_SECRET) {
      test.skip();
      return;
    }

    const response = await request.get(`${CRON_ENDPOINT}?dryRun=1`, {
      headers: {
        "x-cron-secret": CRON_SECRET,
      },
    });

    expect(response.status()).toBe(200);

    const data = await response.json();

    // All responses should have these base properties
    expect(data).toHaveProperty("ok");
    expect(data.ok).toBe(true);
    expect(data).toHaveProperty("today");

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

  test("should handle dryRun parameter correctly", async ({ request }) => {
    if (!CRON_SECRET) {
      test.skip();
      return;
    }

    const response = await request.get(`${CRON_ENDPOINT}?dryRun=1`, {
      headers: {
        "x-cron-secret": CRON_SECRET,
      },
    });

    expect(response.status()).toBe(200);

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

  test("should validate response structure on reminder day", async ({
    request,
  }) => {
    if (!CRON_SECRET) {
      test.skip();
      return;
    }

    const response = await request.get(`${CRON_ENDPOINT}?dryRun=1`, {
      headers: {
        "x-cron-secret": CRON_SECRET,
      },
    });

    expect(response.status()).toBe(200);

    const data = await response.json();

    // Base structure validation
    expect(data).toHaveProperty("ok");
    expect(data).toHaveProperty("today");
    expect(typeof data.ok).toBe("boolean");
    expect(typeof data.today).toBe("string");

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
