"use server";
import {
  ActionState,
  fromErrorToActionState,
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

export const createComment = async <T = unknown,>(
  ticketId: string,
  _actionState: ActionState<T>,
  formData: FormData
): Promise<ActionState<T>> => {
  const { user } = await getAuthOrRedirect();
  let comment;
  try {
    const data = createCommentSchema.parse(Object.fromEntries(formData));
    comment = await prisma.comment.create({
      data: { ticketId, userId: user.id, ...data },
      include: {
        user: true,
      },
    });
  } catch (error) {
    return fromErrorToActionState<T>(error, formData);
  }

  revalidatePath(ticketPath(ticketId));
  return toActionState<T>("SUCCESS", "Comment created", undefined, {
    ...comment,
    isOwner: true,
  } as T);
};
