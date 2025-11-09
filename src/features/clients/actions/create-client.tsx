"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/util/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { dashboardPath } from "@/paths";
import { revalidatePath } from "next/cache";
import z from "zod";

const createClientSchema = z.object({
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

function normalizeToE164(raw: string | undefined | null): string | undefined {
  if (!raw) return undefined;
  const digits = String(raw).replace(/\D/g, "");
  if (digits.length === 0) return undefined;
  if (digits.startsWith("1") && digits.length === 11) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  if (raw.trim().startsWith("+")) return raw.trim();
  return undefined;
}

export const createClient = async (
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  await getAuthOrRedirect();

  try {
    const firstName = formData.get("firstName") as string | null;
    const lastName = formData.get("lastName") as string | null;
    const email = formData.get("email") as string | null;
    const phone = normalizeToE164(formData.get("phone") as string | null);

    const data = createClientSchema.parse({
      firstName,
      lastName,
      email,
      phone,
    });

    const createdClient = await prisma.client.create({
      data,
    });

    revalidatePath(dashboardPath());

    return toActionState("SUCCESS", "Cliente creado", undefined, createdClient);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
};
