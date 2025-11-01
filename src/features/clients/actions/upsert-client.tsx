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
import { normalizeToE164, upsertClientSchema } from "./client-schema";

export const upsertClient = async (
  id: string | undefined,
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  await getAuthOrRedirect();

  try {
    const nombre = formData.get("firstName") as string | null;
    const apellido = formData.get("lastName") as string | null;
    const email = formData.get("email") as string | null;
    const telefono = normalizeToE164(formData.get("phone") as string | null);

    const data = upsertClientSchema.parse({
      nombre,
      apellido,
      email,
      telefono,
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
