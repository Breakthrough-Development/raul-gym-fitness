import { expect, test } from "@playwright/test";

test.describe("WhatsApp Cron API - Authentication", () => {
  const CRON_ENDPOINT = "/api/cron/whatsapp";

  test.describe("Unauthorized Requests", () => {
    test("should return 401 when no x-cron-secret header is provided", async ({
      request,
    }) => {
      await test.step("Make request without auth header", async () => {
        const response = await request.get(CRON_ENDPOINT);

        expect(response.status()).toBe(401);
      });

      await test.step("Verify error response structure", async () => {
        const response = await request.get(CRON_ENDPOINT);
        const data = await response.json();

        expect(data).toHaveProperty("error");
        expect(data.error).toBe("Unauthorized");
      });
    });

    test("should return 401 when wrong x-cron-secret header is provided", async ({
      request,
    }) => {
      await test.step("Make request with invalid secret", async () => {
        const response = await request.get(CRON_ENDPOINT, {
          headers: {
            "x-cron-secret": "wrong-secret-value",
          },
        });

        expect(response.status()).toBe(401);
      });

      await test.step("Verify error response structure", async () => {
        const response = await request.get(CRON_ENDPOINT, {
          headers: {
            "x-cron-secret": "wrong-secret-value",
          },
        });
        const data = await response.json();

        expect(data).toHaveProperty("error");
        expect(data.error).toBe("Unauthorized");
      });
    });
  });
});

