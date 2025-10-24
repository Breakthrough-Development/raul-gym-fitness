import { fetchWhatsAppTemplates } from "@/lib/whatsapp";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await fetchWhatsAppTemplates();

    if (!result.ok) {
      return NextResponse.json(
        { error: "Failed to fetch templates", details: result.error },
        { status: result.status }
      );
    }

    // Filter only approved templates
    const approvedTemplates = result.templates.filter(
      (template) => template.status === "APPROVED"
    );

    return NextResponse.json({ templates: approvedTemplates });
  } catch (error) {
    console.error("Error fetching WhatsApp templates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
