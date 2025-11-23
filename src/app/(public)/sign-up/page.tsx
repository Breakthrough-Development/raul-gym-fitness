import { CardComp } from "@/components/card-comp";
import { Button } from "@/components/ui/button";
import { SignUpForm } from "@/features/auth/component/sign-up-form";
import { signInPath } from "@/paths";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Registrarse | Raul Gym Fitness",
  description: "Regístrate para comenzar a usar Raul Gym Fitness",
};

const SignUpPage = () => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <CardComp
        title="Registrarse"
        description="Regístrate para comenzar"
        content={<SignUpForm />}
        footer={
          <Button variant="ghost" className="w-full" asChild>
            <Link href={signInPath()}>
              ¿Ya tienes cuenta? Inicia sesión ahora.
            </Link>
          </Button>
        }
      ></CardComp>
    </div>
  );
};

export default SignUpPage;
