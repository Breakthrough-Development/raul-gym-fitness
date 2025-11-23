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
  amount: z.coerce
    .number()
    .positive({ message: "El monto debe ser un número positivo" }),
  membership: z.enum(["DAILY", "MONTHLY"]),
  clientId: z.cuid({ message: "Debes seleccionar un cliente válido" }),
  paymentDate: z.coerce.date({ message: "La fecha de pago debe ser válida" }),
});

export const upsertPayment = async (
  id: string | undefined,
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  await getAuthOrRedirect();

  try {
    const parsed = upsertPaymentSchema.parse({
      amount: formData.get("amount"),
      membership: formData.get("membership"),
      clientId: formData.get("clientId"),
      paymentDate: formData.get("paymentDate"),
    });

    const data = {
      ...parsed,
      membership: parsed.membership as MembershipStatus,
      status: PaymentStatus.PAID,
      paymentDate: parsed.paymentDate,
    };

    await prisma.payment.upsert({
      where: { id: id || "" },
      create: {
        amount: data.amount,
        membership: data.membership,
        status: data.status,
        clientId: data.clientId,
        paymentDate: data.paymentDate,
      },
      update: {
        amount: data.amount,
        membership: data.membership,
        status: data.status,
        clientId: data.clientId,
        paymentDate: data.paymentDate,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(dashboardPath());
  revalidatePath("/"); // Revalidate home page to update dashboard charts

  if (id) {
    await setCookieByKey("toast", "Pago actualizado");
    // redirect(ClientPath(id));
  }
  return toActionState("SUCCESS", "Pago creado");
};
