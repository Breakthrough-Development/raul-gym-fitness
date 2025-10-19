"use server";

import { setCookieByKey } from "@/actions/cookies";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/util/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { ClientPath, dashboardPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

const upsertClientSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "El nombre es requerido" })
    .max(191, { message: "El nombre es muy largo" }),
  apellido: z.string().max(191).optional(),
  email: z.preprocess((v) => {
    if (typeof v !== "string") return v;
    const s = v.trim().toLowerCase();
    return s === "" ? undefined : s;
  }, z.email({ message: "El correo electrónico no es válido" }).max(191, { message: "El correo electrónico es muy largo" }).optional()),
  telefono: z
    .string()
    .max(191, { message: "El teléfono es muy largo" })
    .optional(),
});

export const upsertClient = async (
  id: string | undefined,
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  await getAuthOrRedirect();

  try {
    const rawPhone = String(formData.get("phone") || "");
    const normalizedPhone = rawPhone.replace(/\D/g, "");

    const data = upsertClientSchema.parse({
      nombre: formData.get("firstName"),
      apellido: formData.get("lastName"),
      email: formData.get("email"),
      telefono: normalizedPhone,
    });

    await prisma.cliente.upsert({
      where: { id: id || "" },
      create: data,
      update: data,
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(dashboardPath());

  if (id) {
    await setCookieByKey("toast", "Cliente actualizado");
    redirect(ClientPath(id));
  }
  return toActionState("SUCCESS", "Cliente creado");
};
