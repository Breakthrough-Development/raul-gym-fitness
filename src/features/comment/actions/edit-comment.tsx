"use server";
import {
  ActionState,
  formErrorToActionState,
  toActionState,
} from "@/components/form/util/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { prisma } from "@/lib/prisma";
import { ticketPath } from "@/paths";
import { revalidatePath } from "next/cache";
import z from "zod";

const editCommentSchema = z.object({
  content: z.string().min(1).max(1024),
});

export const editComment = async (
  id: string,
  _actionState: ActionState,
  formData: FormData
) => {
  const { user } = await getAuthOrRedirect();
  const comment = await prisma.comment.findUnique({
    where: { id },
  });
  if (!comment || !isOwner(user, comment)) {
    return toActionState("ERROR", "Not Authorized", formData);
  }
  try {
    const data = editCommentSchema.parse(Object.fromEntries(formData));

    await prisma.comment.update({
      where: { id },
      data: {
        content: data.content,
      },
    });
  } catch (error) {
    return formErrorToActionState(error, formData);
  }
  revalidatePath(ticketPath(comment.ticketId));
  return toActionState("SUCCESS", "Comment Updated");
};
