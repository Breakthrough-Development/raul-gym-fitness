import { CardComp } from "@/components/card-comp";
import Heading from "@/components/heading";
import Placeholder from "@/components/placeholder";
import { Spinner } from "@/components/spiner";
import { ClientList } from "@/features/clients/components/client-list";
import { ClientUpsertForm } from "@/features/clients/components/client-upsert-form";
import { TotalRevenue } from "@/features/dashboard/components/totalRevenue";
import { TotalSubscriptions } from "@/features/dashboard/components/totalSubscriptions";
import { SearchParamsCache } from "@/features/ticket/search-params";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type HomePageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading title="Home" description="Your home place to start" />

      <Suspense fallback={<Spinner />}>
        <TotalRevenue />
        <TotalSubscriptions title="Daily Subscriptions" type="DAILY" />
        <TotalSubscriptions title="Monthly Subscriptions" type="MONTHLY" />
        <section className="flex-1 flex flex-col gap-y-8">
          <Heading
            title="Clients Page"
            description="All your Clients at one place."
          />

          <CardComp
            title="Client list"
            description="All your clients in one place."
            content={<ClientUpsertForm />}
            className="w-full max-w-[420px] self-center"
          ></CardComp>

          <ErrorBoundary
            fallback={<Placeholder label="Error loading clients" />}
          >
            <Suspense fallback={<Spinner />}>
              <ClientList
                searchParams={SearchParamsCache.parse(await searchParams)}
              ></ClientList>
            </Suspense>
          </ErrorBoundary>
        </section>
      </Suspense>
    </div>
  );
}
