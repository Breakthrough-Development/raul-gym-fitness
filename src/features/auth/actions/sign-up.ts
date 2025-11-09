"use server";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/util/to-action-state";
import { env } from "@/env";
import { hashPassword } from "@/features/password/util/hash-and-verify";
import { createSession } from "@/lib/aslo";
import { prisma } from "@/lib/prisma";
import { homePath } from "@/paths";
import { generateRandomToken } from "@/utils/crypto";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import z from "zod";
import { setSessionCookie } from "../utils/session-cookie";

const signUpSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: "El nombre de usuario es requerido" })
      .max(191, { message: "El nombre de usuario es muy largo" })
      .refine(
        (value) => !value.includes(" "),
        "El nombre de usuario no puede contener espacios"
      ),
    firstName: z
      .string()
      .min(1, { message: "El nombre es requerido" })
      .max(191, { message: "El nombre es muy largo" })
      .refine(
        (value) => !value.includes(" "),
        "El nombre no puede contener espacios"
      ),
    lastName: z
      .string()
      .min(1, { message: "El apellido es requerido" })
      .max(191, { message: "El apellido es muy largo" })
      .refine(
        (value) => !value.includes(" "),
        "El apellido no puede contener espacios"
      ),
    email: z.email({ message: "El correo electrónico no es válido" }).min(1, { message: "El correo electrónico es requerido" }).max(191, { message: "El correo electrónico es muy largo" }),
    phone: z.string().min(1, { message: "El teléfono es requerido" }).max(20, { message: "El teléfono es muy largo" }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }).max(191, { message: "La contraseña es muy larga" }),
    confirmPassword: z.string().min(6, { message: "La confirmación de contraseña debe tener al menos 6 caracteres" }).max(191, { message: "La confirmación de contraseña es muy larga" }),
    "frase-secreta": z.string().min(1, { message: "La frase secreta es requerida" }),
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

    const serverSecret = env.SECRET_FRASE;
    if (secretPhrase !== serverSecret) {
      return toActionState("ERROR", "Frase secreta inválida", formData);
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username: username,
        email,
        password: passwordHash,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
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

  redirect(homePath());
};
