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

export const deletePayment = async (id: string) => {
  await getAuthOrRedirect();
  try {
    const payment = await prisma.pago.findUnique({
      where: { id },
    });

    if (!payment) {
      return toActionState("ERROR", "Pago no encontrado");
    }

    await prisma.pago.delete({
      where: {
        id,
      },
    });

    revalidatePath(homePath());
    await setCookieByKey("toast", "Pago eliminado");

    return toActionState("SUCCESS", "Pago eliminado exitosamente");
  } catch (error) {
    return fromErrorToActionState(error);
  }
};
