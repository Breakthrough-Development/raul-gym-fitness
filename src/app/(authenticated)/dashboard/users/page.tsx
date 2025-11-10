import { AccountTabs } from "@/app/(authenticated)/account/_navigation/account-tabs";
import Heading from "@/components/heading";
import { UserUpdateForm } from "@/features/auth/component/user-update-form";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { featureFlags } from "@/lib/feature-flags";
import { homePath } from "@/paths";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Usuarios | Raul Gym Fitness",
  description: "Gestiona los usuarios del sistema",
};

const profilePage = async () => {
  if (!featureFlags.userManagement) {
    redirect(homePath());
  }

  const { user: authUser } = await getAuthOrRedirect();

  return (
    <section className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Profile"
        description="All your profile information"
        tabs={<AccountTabs />}
      />
      <div className="w-full max-w-[420px] self-center">
        <UserUpdateForm
          lastName={authUser.lastName}
          firstName={authUser.firstName}
          username={authUser.username}
          email={authUser.email}
          phone={authUser.phone}
        />
      </div>
    </section>
  );
};

export default profilePage;
