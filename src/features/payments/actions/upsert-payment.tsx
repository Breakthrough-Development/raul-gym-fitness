"use server";

import { setCookieByKey } from "@/actions/cookies";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/util/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { dashboardPath } from "@/paths";
import { MembershipStatus, PaymentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import z from "zod";

const upsertPaymentSchema = z.object({
  amount: z.coerce.number().positive(),
  membership: z.enum(MembershipStatus),
  clientId: z.cuid(),
});

export const upsertPayment = async (
  id: string | undefined,
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  await getAuthOrRedirect();

  try {
    const data = {
      ...upsertPaymentSchema.parse({
        amount: formData.get("amount"),
        membership: formData.get("membership"),
        clientId: formData.get("clientId"),
      }),
      status: PaymentStatus.PAID,
    };

    await prisma.payment.upsert({
      where: { id: id || "" },
      create: data,
      update: data,
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(dashboardPath());

  if (id) {
    await setCookieByKey("toast", "Payment updated");
    // redirect(ClientPath(id));
  }
  return toActionState("SUCCESS", "Payment Created");
};
