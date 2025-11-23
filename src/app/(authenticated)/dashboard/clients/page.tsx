import { CardComp } from "@/components/card-comp";
import Heading from "@/components/heading";
import { Spinner } from "@/components/spiner";
import { ClientSearchParamsCache } from "@/features/clients/client-search-params";
import { ClientList } from "@/features/clients/components/client-list";
import { ClientUpsertForm } from "@/features/clients/components/client-upsert-form";
import { featureFlags } from "@/lib/feature-flags";
import { homePath } from "@/paths";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Clientes | Raul Gym Fitness",
  description: "Gestiona tus clientes",
};

type ClientsPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  if (!featureFlags.clientManagement) {
    redirect(homePath());
  }

  const parsedSearchParams = ClientSearchParamsCache.parse(await searchParams);

  return (
    <section className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Página de clientes"
        description="Todos tus clientes en un solo lugar."
      />
      <CardComp
        title="Lista de clientes"
        description="Todos tus clientes en un solo lugar."
        content={<ClientUpsertForm />}
        className="w-full max-w-[420px] self-center"
      />
      <Suspense fallback={<Spinner />}>
        <ClientList searchParams={parsedSearchParams} />
      </Suspense>
    </section>
  );
}
