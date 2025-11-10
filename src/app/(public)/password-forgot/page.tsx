import { featureFlags } from "@/lib/feature-flags";
import { signInPath } from "@/paths";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Recuperar contraseña | Raul Gym Fitness",
  description: "Recupera tu contraseña de Raul Gym Fitness",
};

const ForgotPasswordPage = () => {
  if (!featureFlags.passwordReset) {
    redirect(signInPath());
  }

  return <h2 className="text-lg">Olvidé la contraseña</h2>;
};

export default ForgotPasswordPage;
