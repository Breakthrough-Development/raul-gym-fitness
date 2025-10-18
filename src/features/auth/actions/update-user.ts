"use server";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/util/to-action-state";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import z from "zod";
import { getAuthOrRedirect } from "../queries/get-auth-or-redirect";
import { isOwner } from "../utils/is-owner";

const signUpSchema = z.object({
  username: z
    .string()
    .min(1)
    .max(191)
    .refine(
      (value) => !value.includes(" "),
      "El nombre de usuario no puede contener espacios"
    ),
  firstName: z
    .string()
    .min(1)
    .max(191)
    .refine(
      (value) => !value.includes(" "),
      "El nombre no puede contener espacios"
    ),
  lastName: z
    .string()
    .min(1)
    .max(191)
    .refine(
      (value) => !value.includes(" "),
      "El apellido no puede contener espacios"
    ),
});

export const updateUser = async (
  _actionState: ActionState,
  formData: FormData
) => {
  try {
    const { username, firstName, lastName } = signUpSchema.parse(
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
    if (
      dbUser.username === username ||
      dbUser.firstName === firstName ||
      dbUser.lastName === lastName
    ) {
      return toActionState("ERROR", "No se realizaron cambios", formData);
    }

    await prisma.user.update({
      where: { id: authUser.id },
      data: { username, firstName, lastName },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return toActionState(
        "ERROR",
        "No se pudo actualizar el usuario",
        formData
      );
    }
    return fromErrorToActionState(error, formData);
  }

  return toActionState("SUCCESS", "Usuario actualizado", formData);
};
