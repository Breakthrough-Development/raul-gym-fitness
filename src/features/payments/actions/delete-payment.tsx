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
    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      return toActionState("ERROR", "Payment not found");
    }

    await prisma.payment.delete({
      where: {
        id,
      },
    });

    revalidatePath(homePath());
    await setCookieByKey("toast", "Payment deleted");

    return toActionState("SUCCESS", "Payment deleted successfully");
  } catch (error) {
    return fromErrorToActionState(error);
  }
};
