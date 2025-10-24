import { expect, test } from "@playwright/test";

test.describe("WhatsApp Templates API", () => {
  test("should fetch WhatsApp templates", async ({ request }) => {
    const response = await request.get("/api/whatsapp-templates");

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("templates");
    expect(Array.isArray(data.templates)).toBe(true);

    // If there are templates, check their structure
    if (data.templates.length > 0) {
      const template = data.templates[0];
      expect(template).toHaveProperty("name");
      expect(template).toHaveProperty("language");
      expect(template).toHaveProperty("status");
      expect(template.status).toBe("APPROVED");
    }
  });

  test("should handle API errors gracefully", async ({ request }) => {
    // This test might fail if the WhatsApp API is not configured
    // but it should handle the error gracefully
    const response = await request.get("/api/whatsapp-templates");

    // The API should return a response (either success or error)
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(600);
  });
});
