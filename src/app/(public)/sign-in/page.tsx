import { CardComp } from "@/components/card-comp";
import { Button } from "@/components/ui/button";
import { SignInForm } from "@/features/auth/component/sign-in-form";
import { passwordForgotPath, signUpPath } from "@/paths";
import Link from "next/link";
const SignInPage = () => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <CardComp
        title="Iniciar sesión"
        description="Accede a tu cuenta"
        className="w-full max-w-[420px] animate-fade-from-top"
        content={<SignInForm />}
        footer={
          <div className="flex flex-row flex-wrap justify-between w-full">
            <Button asChild variant="ghost" size="lg">
              <Link href={signUpPath()}>
                ¿Aún no tienes cuenta?
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href={passwordForgotPath()}>
                ¿Olvidaste tu contraseña?
              </Link>
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default SignInPage;
