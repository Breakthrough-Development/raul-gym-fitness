"use server";

import { signInPath } from "@/paths";
import { getAuth } from "../queries/get-auth";
import { redirect } from "next/navigation";
import { invalidateSession } from "@/lib/aslo";
import { deleteSessionCookie } from "../util/session-cookie";

export const signOut = async () => {
  const { session } = await getAuth();

  if (!session) {
    redirect(signInPath());
  }

  await invalidateSession(session.id);
  await deleteSessionCookie();

  redirect(signInPath());
};
