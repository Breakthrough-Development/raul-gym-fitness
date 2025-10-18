import { AccountTabs } from "@/app/(authenticated)/account/_navigation/account-tabs";
import Heading from "@/components/heading";
import { UserUpdateForm } from "@/features/auth/component/user-update-form";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";

const profilePage = async () => {
  const { user: authUser } = await getAuthOrRedirect();

  return (
    <section className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Perfil"
        description="Toda tu información de perfil"
        tabs={<AccountTabs />}
      />
      <div className="w-full max-w-[420px] self-center">
        <UserUpdateForm
          lastName={authUser.lastName || ""}
          firstName={authUser.firstName}
          username={authUser.username}
        />
      </div>
    </section>
  );
};

export default profilePage;
