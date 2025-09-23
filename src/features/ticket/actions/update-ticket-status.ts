"use server";
import { ticketsPath } from "@/paths";
import { revalidatePath } from "next/cache";
import {
  formErrorToActionState,
  toActionState,
} from "@/components/form/util/to-action-state";
import { prisma } from "@/lib/prisma";
import { TicketStatus } from "@prisma/client";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";

export const updateTicketStatus = async (id: string, status: TicketStatus) => {
  const { user } = await getAuthOrRedirect();
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket || !isOwner(user, ticket)) {
      return toActionState("ERROR", "Not Authorized");
    }
    await prisma.ticket.update({
      where: { id },
      data: { status },
    });
  } catch (error) {
    return formErrorToActionState(error);
  }

  revalidatePath(ticketsPath());

  return toActionState("SUCCESS", "Status updated");
};
