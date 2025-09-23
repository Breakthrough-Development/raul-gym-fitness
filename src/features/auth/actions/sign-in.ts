"use server";

import {
  ActionState,
  formErrorToActionState,
  toActionState,
} from "@/components/form/util/to-action-state";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/paths";
import { redirect } from "next/navigation";
import { verifyPasswordHash } from "@/features/password/util/hash-and-verify";
import { createSession } from "@/lib/aslo";
import { generateRandomToken } from "@/utils/crypto";
import { setSessionCookie } from "../util/session-cookie";

const signInSchema = z.object({
  email: z.email().min(1, { message: "Is required" }).max(191),
  password: z.string().min(6).max(191),
});

const signIn = async (_actionState: ActionState, formData: FormData) => {
  try {
    const { email, password } = signInSchema.parse(
      Object.fromEntries(formData)
    );

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return toActionState("ERROR", "Incorrect email or password", formData);
    }

    const validPassword = await verifyPasswordHash(user.password, password);

    if (!validPassword) {
      return toActionState("ERROR", "Incorrect email or password", formData);
    }

    const sessionToken = generateRandomToken();
    const sessionCookie = await createSession(sessionToken, user.id);

    await setSessionCookie(sessionToken, sessionCookie.expiresAt);
  } catch (error) {
    return formErrorToActionState(error, formData);
  }
  redirect(ticketsPath());
};

export { signIn };
