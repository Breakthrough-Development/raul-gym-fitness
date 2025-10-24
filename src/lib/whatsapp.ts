import { env } from "@/env";

type SendResult =
  | {
      ok: true;
      messageId: string;
    }
  | {
      ok: false;
      status: number;
      error: string;
    };

export async function sendWhatsAppTemplate(
  toE164: string,
  templateName: string,
  variables: string[],
  languageCode = "en_US",
  attempt = 0
): Promise<SendResult> {
  const phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID;
  const token = env.WHATSAPP_ACCESS_TOKEN;
  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

  const body = {
    messaging_product: "whatsapp",
    to: toE164,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      components: [
        {
          type: "body",
          parameters: variables.map((v) => ({ type: "text", text: v })),
        },
      ],
    },
  } as const;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response
      .json()
      .catch(() => ({} as { messages: { id: string; message_id: string }[] }));
    const messageId: string | undefined =
      data?.messages?.[0]?.id ?? data?.messages?.[0]?.message_id;
    return { ok: true, messageId: messageId || "" };
  }

  // 5xx retry up to 2 times
  if (response.status >= 500 && response.status < 600 && attempt < 2) {
    await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    return sendWhatsAppTemplate(
      toE164,
      templateName,
      variables,
      languageCode,
      attempt + 1
    );
  }

  const errorText = await response.text().catch(() => "");
  return { ok: false, status: response.status, error: errorText };
}

export type WhatsAppTemplate = {
  name: string;
  language: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | "DISABLED";
  category: string;
  components: Array<{
    type: "HEADER" | "BODY" | "FOOTER" | "BUTTONS";
    text?: string;
    format?: string;
    example?: {
      header_text?: string[];
      body_text?: string[];
    };
  }>;
};

type FetchTemplatesResult =
  | {
      ok: true;
      templates: WhatsAppTemplate[];
    }
  | {
      ok: false;
      status: number;
      error: string;
    };

export async function fetchWhatsAppTemplates(): Promise<FetchTemplatesResult> {
  const phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID;
  const token = env.WHATSAPP_ACCESS_TOKEN;
  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/message_templates`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const data = await response
      .json()
      .catch(() => ({} as { data: WhatsAppTemplate[] }));
    return { ok: true, templates: data?.data || [] };
  }

  const errorText = await response.text().catch(() => "");
  return { ok: false, status: response.status, error: errorText };
}
