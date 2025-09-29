"use server";
import {
  ActionState,
  formErrorToActionState,
  toActionState,
} from "@/components/form/util/to-action-state";
import {
  hashPassword,
  verifyPasswordHash,
} from "@/features/password/util/hash-and-verify";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import z from "zod";
import { getAuthOrRedirect } from "../queries/get-auth-or-redirect";
import { isOwner } from "../utils/is-owner";

const signUpSchema = z
  .object({
    currentPassword: z.string().min(6).max(191),
    newPassword: z.string().min(6).max(191),
    confirmPassword: z.string().min(6).max(191),
  })
  .superRefine(({ confirmPassword, newPassword, currentPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "New passwords do not match",
        path: ["confirmPassword"],
      });
    }
    if (currentPassword === newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "New password cannot be the same as the current password",
        path: ["newPassword"],
      });
    }
  });

export const resetPassword = async (
  _actionState: ActionState,
  formData: FormData
) => {
  try {
    const { currentPassword, newPassword } = signUpSchema.parse(
      Object.fromEntries(formData)
    );

    const { user: authUser } = await getAuthOrRedirect();

    const dbUser = await prisma.user.findUnique({
      where: {
        id: authUser.id,
      },
    });

    if (!dbUser) {
      return toActionState("ERROR", "User not found", formData);
    }

    if (!isOwner(authUser, { userId: dbUser.id })) {
      return toActionState("ERROR", "Not Authorized", formData);
    }

    const validPassword = await verifyPasswordHash(
      dbUser.password,
      currentPassword
    );

    if (!validPassword) {
      return toActionState("ERROR", "Incorrect current password", formData);
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: {
        id: authUser.id,
      },
      data: {
        password: passwordHash,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return toActionState("ERROR", "Couldn't update password", formData);
    }
    return formErrorToActionState(error, formData);
  }

  return toActionState("SUCCESS", "Password updated");
};
