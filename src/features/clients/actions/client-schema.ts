import z from "zod";

export const upsertClientSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "El nombre es requerido" })
    .max(191, { message: "El nombre es muy largo" }),
  lastName: z.string().max(191).optional(),
  email: z.preprocess((v) => {
    if (typeof v !== "string") return v;
    const s = v.trim().toLowerCase();
    return s === "" ? undefined : s;
  }, z.email({ message: "El correo electrónico no es válido" }).max(191, { message: "El correo electrónico es muy largo" }).optional()),
  phone: z
    .string()
    .max(191, { message: "El teléfono es muy largo" })
    .optional(),
});

export function normalizeToE164(
  raw: string | undefined | null
): string | undefined {
  if (!raw) return undefined;
  const digits = String(raw).replace(/\D/g, "");
  if (digits.length === 0) return undefined;
  if (digits.startsWith("1") && digits.length === 11) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  if (raw.trim().startsWith("+")) return raw.trim();
  return undefined;
}
