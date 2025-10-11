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
    .refine((value) => !value.includes(" "), "Username cannot contain spaces"),
  firstName: z
    .string()
    .min(1)
    .max(191)
    .refine(
      (value) => !value.includes(" "),
      "First Name cannot contain spaces"
    ),
  lastName: z
    .string()
    .min(1)
    .max(191)
    .refine((value) => !value.includes(" "), "Last Name cannot contain spaces"),
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
      return toActionState("ERROR", "User not found", formData);
    }
    if (!isOwner(authUser, { userId: dbUser.id })) {
      return toActionState("ERROR", "Not Authorized", formData);
    }
    if (
      dbUser.username === username ||
      dbUser.firstName === firstName ||
      dbUser.lastName === lastName
    ) {
      return toActionState("ERROR", "No changes made", formData);
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
      return toActionState("ERROR", "Couldn't update user", formData);
    }
    return fromErrorToActionState(error, formData);
  }

  return toActionState("SUCCESS", "User updated", formData);
};
