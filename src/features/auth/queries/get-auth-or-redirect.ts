import { signInPath } from "@/paths";
import { getAuth } from "./get-auth";
import { redirect } from "next/navigation";

export const getAuthOrRedirect = async () => {
  const auth = await getAuth();

  if (!auth.user) {
    redirect(signInPath());
  }

  return auth;
};
