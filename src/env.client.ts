import { z } from "zod";

// CLIENT-SAFE ENVIRONMENT VARIABLES
// ✅ Safe to import in client components - only contains NEXT_PUBLIC_* variables
const clientSchema = z.object({
  NEXT_PUBLIC_VERCEL_URL: z.string().url().optional(),
});

export const clientEnv = clientSchema.parse(process.env);
