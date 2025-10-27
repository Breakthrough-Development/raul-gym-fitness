import { CardComp } from "@/components/card-comp";
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
            <Link
              className="text-base text-muted-foreground md:text-lg"
              href={signUpPath()}
            >
              ¿Aún no tienes cuenta?
            </Link>
            <Link
              className="text-base text-muted-foreground md:text-lg"
              href={passwordForgotPath()}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        }
      />
    </div>
  );
};

export default SignInPage;
