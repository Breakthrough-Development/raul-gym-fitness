"use server";

import { setCookieByKey } from "@/actions/cookies";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/util/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { prisma } from "@/lib/prisma";
import { dashboardPath, dashboardUserPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

const upsertClientSchema = z.object({
  firstName: z.string().min(1).max(191),
  lastName: z.string().min(1).max(191),
  email: z.string().min(1).max(191),
  phone: z.string().min(1).max(191),
});

export const upsertClient = async (
  id: string | undefined,
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const { user } = await getAuthOrRedirect();

  try {
    if (id) {
      const ticket = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user || !isOwner(user, user)) {
        return toActionState("ERROR", "Not authorized", formData);
      }
    }
    const data = upsertClientSchema.parse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    });

    const dbData = {
      ...data,
      userId: user.id,
    };

    await prisma.user.upsert({
      where: { id: id || "" },
      update: dbData,
      create: dbData,
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(dashboardPath());

  if (id) {
    await setCookieByKey("toast", "Client updated");
    redirect(dashboardUserPath(id));
  }
  return toActionState("SUCCESS", "Client Created");
};
