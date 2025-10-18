"use server";
import {
  ActionState,
  fromErrorToActionState,
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
        message: "Las nuevas contraseñas no coinciden",
        path: ["confirmPassword"],
      });
    }
    if (currentPassword === newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "La nueva contraseña no puede ser igual a la actual",
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
      return toActionState("ERROR", "Usuario no encontrado", formData);
    }

    if (!isOwner(authUser, { userId: dbUser.id })) {
      return toActionState("ERROR", "No autorizado", formData);
    }

    const validPassword = await verifyPasswordHash(
      dbUser.password,
      currentPassword
    );

    if (!validPassword) {
      return toActionState("ERROR", "Contraseña actual incorrecta", formData);
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
      return toActionState(
        "ERROR",
        "No se pudo actualizar la contraseña",
        formData
      );
    }
    return fromErrorToActionState(error, formData);
  }

  return toActionState("SUCCESS", "Contraseña actualizada");
};
