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
    const client = await prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      return toActionState("ERROR", "Client not found");
    }

    await prisma.client.delete({
      where: { id },
    });

    revalidatePath(homePath());
    await setCookieByKey("toast", "Client deleted");

    return toActionState("SUCCESS", "Client deleted successfully");
  } catch (error) {
    return fromErrorToActionState(error);
  }
};
