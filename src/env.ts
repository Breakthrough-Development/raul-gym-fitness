import { z } from "zod";

function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

// SERVER-ONLY ENVIRONMENT VARIABLES
// ⚠️  WARNING: This file should NEVER be imported in client components!
// ⚠️  Only import this in: API routes, server actions, server components, middleware, build scripts
const serverSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  SECRET_FRASE: z.string().min(1, "SECRET_FRASE is required"),
  WHATSAPP_PHONE_NUMBER_ID: z
    .string()
    .min(1, "WHATSAPP_PHONE_NUMBER_ID is required"),
  WHATSAPP_ACCESS_TOKEN: z.string().min(1, "WHATSAPP_ACCESS_TOKEN is required"),
  WHATSAPP_BUSINESS_ACCOUNT_ID: z
    .string()
    .min(1, "WHATSAPP_BUSINESS_ACCOUNT_ID is required"),
  WHATSAPP_TEMPLATE_PRE: z.string().min(1, "WHATSAPP_TEMPLATE_PRE is required"),
  WHATSAPP_TEMPLATE_POST: z
    .string()
    .min(1, "WHATSAPP_TEMPLATE_POST is required"),
  CRON_SECRET: z.string().min(1, "CRON_SECRET is required"),
  TIMEZONE: z
    .string()
    .refine(
      isValidTimeZone,
      "TIMEZONE must be a valid IANA tz, e.g. America/Santo_Domingo"
    ),
  WHATSAPP_MAX_PER_RUN: z.coerce.number().int().positive().default(500),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  // Seed-only vars: optional
  SEED_PASSWORD: z.string().optional(),
  SEED_PHONE: z.string().optional(),
  SEED_PHONE_USER: z.string().optional(),
});

export const env = serverSchema.parse(process.env);
