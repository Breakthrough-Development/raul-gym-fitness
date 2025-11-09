import {
  getPostEomCandidates,
  getPreEomCandidates,
} from "@/features/payments/queries/renewal-cohorts";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppTemplate } from "@/lib/whatsapp";
import {
  getCurrentYearMonth,
  getPrevYearMonth,
  getTodayInTimeZone,
  isPostEomReminderDay,
  isPreEomReminderDay,
  monthLongName,
} from "@/utils/date";
// Use string literals for enums to avoid client version desync
import { env } from "@/env";
import { featureFlags } from "@/lib/feature-flags";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function requireSecret(req: NextRequest) {
  const provided = req.headers.get("x-cron-secret");
  const expected = env.CRON_SECRET;
  return provided && expected && provided === expected;
}

export async function GET(req: NextRequest) {
  if (!requireSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!featureFlags.whatsappNotifications) {
    return NextResponse.json(
      { ok: false, message: "WhatsApp notifications feature is disabled" },
      { status: 403 }
    );
  }

  const url = new URL(req.url);
  const dryRun = url.searchParams.get("dryRun") === "1";
  const timeZone = env.TIMEZONE;
  const today = getTodayInTimeZone(timeZone);
  const current = getCurrentYearMonth(timeZone);
  const prev = getPrevYearMonth(current);

  type WhatsappNotificationDelegate = {
    create: (args: {
      data: {
        clientId: string;
        cohort: "PRE_EOM" | "POST_EOM";
        year: number;
        month: number;
        status: "SENT" | "SKIPPED" | "FAILED";
        providerMessageId?: string;
        error?: string;
      };
    }) => Promise<unknown>;
  };
  const whatsapp = (
    prisma as unknown as { whatsappNotification: WhatsappNotificationDelegate }
  ).whatsappNotification;

  const isPre = isPreEomReminderDay(timeZone);
  const isPost = isPostEomReminderDay(timeZone);

  if (!isPre && !isPost) {
    return NextResponse.json({ 
      ok: true, 
      message: "No cohort today", 
      today: `${today.year}-${String(today.month).padStart(2, "0")}-${String(today.day).padStart(2, "0")}` 
    });
  }

  const preTemplate = env.WHATSAPP_TEMPLATE_PRE;
  const postTemplate = env.WHATSAPP_TEMPLATE_POST;
  const maxSends = env.WHATSAPP_MAX_PER_RUN;

  const results: Array<{ id: string; sent?: boolean; skipped?: boolean }> = [];

  async function processPre() {
    const candidates = await getPreEomCandidates(timeZone);
    for (const c of candidates.slice(0, maxSends)) {
      const phone = c.phone;
      if (!phone?.startsWith("+")) {
        if (!dryRun) {
          await whatsapp.create({
            data: {
              clientId: c.id,
              cohort: "PRE_EOM",
              year: current.year,
              month: current.month,
              status: "SKIPPED",
              error: "Missing or invalid E.164 phone",
            },
          });
        }
        results.push({ id: c.id, skipped: true });
        continue;
      }

      const monthName = monthLongName(current.year, current.month);
      const vars = [c.firstName, monthName];

      if (!dryRun) {
        const send = await sendWhatsAppTemplate(phone, preTemplate, vars);
        if (send.ok) {
          await whatsapp.create({
            data: {
              clientId: c.id,
              cohort: "PRE_EOM",
              year: current.year,
              month: current.month,
              status: "SENT",
              providerMessageId: send.messageId,
            },
          });
        } else {
          await whatsapp.create({
            data: {
              clientId: c.id,
              cohort: "PRE_EOM",
              year: current.year,
              month: current.month,
              status: "FAILED",
              error: `${send.status} ${send.error}`.slice(0, 900),
            },
          });
        }
      }
      results.push({ id: c.id, sent: !dryRun });
    }
  }

  async function processPost() {
    const candidates = await getPostEomCandidates(timeZone);
    for (const c of candidates.slice(0, maxSends)) {
      const phone = c.phone;
      if (!phone?.startsWith("+")) {
        if (!dryRun) {
          await whatsapp.create({
            data: {
              clientId: c.id,
              cohort: "POST_EOM",
              year: current.year,
              month: current.month,
              status: "SKIPPED",
              error: "Missing or invalid E.164 phone",
            },
          });
        }
        results.push({ id: c.id, skipped: true });
        continue;
      }

      const monthName = monthLongName(prev.year, prev.month);
      const vars = [c.firstName, monthName];

      if (!dryRun) {
        const send = await sendWhatsAppTemplate(phone, postTemplate, vars);
        if (send.ok) {
          await whatsapp.create({
            data: {
              clientId: c.id,
              cohort: "POST_EOM",
              year: current.year,
              month: current.month,
              status: "SENT",
              providerMessageId: send.messageId,
            },
          });
        } else {
          await whatsapp.create({
            data: {
              clientId: c.id,
              cohort: "POST_EOM",
              year: current.year,
              month: current.month,
              status: "FAILED",
              error: `${send.status} ${send.error}`.slice(0, 900),
            },
          });
        }
      }
      results.push({ id: c.id, sent: !dryRun });
    }
  }

  if (isPre) await processPre();
  if (isPost) await processPost();

  return NextResponse.json({
    ok: true,
    today: `${today.year}-${String(today.month).padStart(2, "0")}-${String(today.day).padStart(2, "0")}`,
    processed: results.length,
    results,
  });
}
