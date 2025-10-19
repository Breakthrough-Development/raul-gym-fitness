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
import { EstadoMembresia, EstadoPago } from "@prisma/client";
import { revalidatePath } from "next/cache";
import z from "zod";

const upsertPaymentSchema = z.object({
  amount: z.coerce.number().positive(),
  membership: z.enum(EstadoMembresia),
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
      status: EstadoPago.PAGADO,
    };

    await prisma.pago.upsert({
      where: { id: id || "" },
      create: {
        monto: data.amount,
        membresia: data.membership,
        estado: data.status,
        clienteId: data.clientId,
      },
      update: {
        monto: data.amount,
        membresia: data.membership,
        estado: data.status,
        clienteId: data.clientId,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(dashboardPath());

  if (id) {
    await setCookieByKey("toast", "Pago actualizado");
    // redirect(ClientPath(id));
  }
  return toActionState("SUCCESS", "Pago creado");
};
