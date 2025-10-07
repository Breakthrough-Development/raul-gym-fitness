"use server";
import {
  ActionState,
  formErrorToActionState,
  toActionState,
} from "@/components/form/util/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { ticketPath } from "@/paths";
import { revalidatePath } from "next/cache";
import z from "zod";

const createCommentSchema = z.object({
  content: z.string().min(1).max(1024),
});

export const createComment = async (
  ticketId: string,
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const { user } = await getAuthOrRedirect();

  try {
    const data = createCommentSchema.parse(Object.fromEntries(formData));
    await prisma.comment.create({
      data: { ticketId, userId: user.id, ...data },
    });
  } catch (error) {
    return formErrorToActionState(error, formData);
  }

  revalidatePath(ticketPath(ticketId));
  return toActionState("SUCCESS", "Comment created");
};
