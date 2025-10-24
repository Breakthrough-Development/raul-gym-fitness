import { WhatsAppTemplate } from "@/lib/whatsapp";

export async function getWhatsAppTemplates(): Promise<WhatsAppTemplate[]> {
  try {
    const response = await fetch("/api/whatsapp-templates", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch WhatsApp templates:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.templates || [];
  } catch (error) {
    console.error("Error fetching WhatsApp templates:", error);
    return [];
  }
}
