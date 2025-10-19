"use server";

import { setCookieByKey } from "@/actions/cookies";
import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/util/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { homePath } from "@/paths";
import { revalidatePath } from "next/cache";

export const deleteClient = async (id: string) => {
  await getAuthOrRedirect();
  try {
    const client = await prisma.cliente.findUnique({
      where: { id },
    });

    if (!client) {
      return toActionState("ERROR", "Cliente no encontrado");
    }

    await prisma.cliente.delete({
      where: { id },
    });

    revalidatePath(homePath());
    await setCookieByKey("toast", "Cliente eliminado");

    return toActionState("SUCCESS", "Cliente eliminado exitosamente");
  } catch (error) {
    return fromErrorToActionState(error);
  }
};
