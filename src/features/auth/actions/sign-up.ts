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
    email: z.email().min(1, { message: "Es requerido" }).max(191),
    phone: z.string().min(1).max(20),
    password: z.string().min(6).max(191),
    confirmPassword: z.string().min(6).max(191),
    "frase-secreta": z.string().min(1, { message: "Es requerido" }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
      });
    }
  });

export const signUp = async (_actionState: ActionState, formData: FormData) => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      phone,
      ["frase-secreta"]: secretPhrase,
    } = signUpSchema.parse(Object.fromEntries(formData));

    const serverSecret = process.env.NEXT_PUBLIC_SECRET_FRASE ?? "";
    if (!serverSecret) {
      return toActionState("ERROR", "Frase secreta no configurada", formData);
    }
    if (secretPhrase !== serverSecret) {
      return toActionState("ERROR", "Frase secreta inválida", formData);
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: passwordHash,
        firstName,
        lastName,
        phone,
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
        "El correo electrónico o el nombre de usuario ya está en uso",
        formData
      );
    }
    return fromErrorToActionState(error, formData);
  }

  redirect(ticketsPath());
};
