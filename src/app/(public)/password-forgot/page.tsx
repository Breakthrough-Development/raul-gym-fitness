import { featureFlags } from "@/lib/feature-flags";
import { signInPath } from "@/paths";
import { redirect } from "next/navigation";

const ForgotPasswordPage = () => {
  if (!featureFlags.passwordReset) {
    redirect(signInPath());
  }

  return <h2 className="text-lg">Olvidé la contraseña</h2>;
};

export default ForgotPasswordPage;
