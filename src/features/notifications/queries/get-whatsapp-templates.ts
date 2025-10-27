import { WhatsAppTemplate } from "@/lib/whatsapp";
import { getWhatsAppTemplates as getWhatsAppTemplatesAction } from "../actions/get-whatsapp-templates";

export async function getWhatsAppTemplates(): Promise<WhatsAppTemplate[]> {
  return getWhatsAppTemplatesAction();
}
