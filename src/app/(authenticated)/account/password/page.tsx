import { AccountTabs } from "@/app/(authenticated)/account/_navigation/account-tabs";
import Heading from "@/components/heading";
import { ResetPasswordForm } from "@/features/auth/component/update-password-form";

const passwordPage = () => {
  return (
    <section className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Password"
        description="Change your password"
        tabs={<AccountTabs />}
      />
      <div className="w-full max-w-[420px] self-center">
        <ResetPasswordForm />
      </div>
    </section>
  );
};

export default passwordPage;
