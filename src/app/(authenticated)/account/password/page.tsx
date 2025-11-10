import { AccountTabs } from "@/app/(authenticated)/account/_navigation/account-tabs";
import Heading from "@/components/heading";
import { ResetPasswordForm } from "@/features/auth/component/update-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cambiar contraseña | Raul Gym Fitness",
  description: "Actualiza tu contraseña de acceso",
};

const passwordPage = () => {
  return (
    <section className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Contraseña"
        description="Cambia tu contraseña"
        tabs={<AccountTabs />}
      />
      <div className="w-full max-w-[420px] self-center">
        <ResetPasswordForm />
      </div>
    </section>
  );
};

export default passwordPage;
