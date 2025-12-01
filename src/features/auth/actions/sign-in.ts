"use server";

import type { ActionState } from "@/types/action-state";
import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/util/to-action-state";
import { verifyPasswordHash } from "@/features/password/util/hash-and-verify";
import { createSession } from "@/lib/aslo";
import { prisma } from "@/lib/prisma";
import { homePath } from "@/paths";
import { generateRandomToken } from "@/utils/crypto";
import { redirect } from "next/navigation";
import z from "zod";
import { getAuth } from "../queries/get-auth";
import { setSessionCookie } from "../utils/session-cookie";

const signInSchema = z.object({
  email: z.email({ message: "El correo electrónico no es válido" }).min(1, { message: "El correo electrónico es requerido" }).max(191, { message: "El correo electrónico es muy largo" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }).max(191, { message: "La contraseña es muy larga" }),
});

const signIn = async (_actionState: ActionState, formData: FormData) => {
  const { user } = await getAuth();
  if (user) {
    redirect(homePath());
  }
  try {
    const { email, password } = signInSchema.parse(
      Object.fromEntries(formData)
    );

    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) {
      return toActionState(
        "ERROR",
        "Correo o contraseña incorrectos",
        formData
      );
    }

    const validPassword = await verifyPasswordHash(user.password, password);

    if (!validPassword) {
      return toActionState(
        "ERROR",
        "Correo o contraseña incorrectos",
        formData
      );
    }

    const sessionToken = generateRandomToken();
    const sessionCookie = await createSession(sessionToken, user.id);

    await setSessionCookie(sessionToken, sessionCookie.expiresAt);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
  redirect(homePath());
};

export { signIn };
