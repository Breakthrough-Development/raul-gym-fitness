"use server";

import { fetchWhatsAppTemplates, WhatsAppTemplate } from "@/lib/whatsapp";

export async function getWhatsAppTemplates(): Promise<WhatsAppTemplate[]> {
  try {
    const result = await fetchWhatsAppTemplates();

    if (!result.ok) {
      console.error("Failed to fetch WhatsApp templates:", result.error);
      return [];
    }

    // Filter only approved templates
    const approvedTemplates = result.templates.filter(
      (template) => template.status === "APPROVED"
    );

    return approvedTemplates;
  } catch (error) {
    console.error("Error fetching WhatsApp templates:", error);
    return [];
  }
}

