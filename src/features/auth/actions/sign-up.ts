"use server";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/util/to-action-state";
import { hashPassword } from "@/features/password/util/hash-and-verify";
import { createSession } from "@/lib/aslo";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/paths";
import { generateRandomToken } from "@/utils/crypto";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import z from "zod";
import { setSessionCookie } from "../utils/session-cookie";

const signUpSchema = z
  .object({
    username: z
      .string()
      .min(1)
      .max(191)
      .refine(
        (value) => !value.includes(" "),
        "Username cannot contain spaces"
      ),
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
      .refine(
        (value) => !value.includes(" "),
        "Last Name cannot contain spaces"
      ),
    email: z.email().min(1, { message: "Is required" }).max(191),
    password: z.string().min(6).max(191),
    confirmPassword: z.string().min(6).max(191),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export const signUp = async (_actionState: ActionState, formData: FormData) => {
  try {
    const { username, email, password, firstName, lastName } =
      signUpSchema.parse(Object.fromEntries(formData));

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: passwordHash,
        firstName,
        lastName,
      },
    });

    const sessionToken = generateRandomToken();
    const sessionCookie = await createSession(sessionToken, user.id);

    await setSessionCookie(sessionToken, sessionCookie.expiresAt);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return toActionState(
        "ERROR",
        "Either email or username is already in use",
        formData
      );
    }
    return fromErrorToActionState(error, formData);
  }

  redirect(ticketsPath());
};
