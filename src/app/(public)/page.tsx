import { CardComp } from "@/components/card-comp";
import Heading from "@/components/heading";
import Placeholder from "@/components/placeholder";
import { Spinner } from "@/components/spiner";
import { ClientUpsertForm } from "@/features/clients/components/ticket-upsert-form";
import { TotalRevenue } from "@/features/dashboard/components/totalRevenue";
import { TotalSubscriptions } from "@/features/dashboard/components/totalSubscriptions";
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
            title="Tickets Page"
            description="All your tickets at one place."
          />

          <CardComp
            title="Client list"
            description="All your clients in one place."
            content={<ClientUpsertForm />}
            className="w-full max-w-[420px] self-center"
          ></CardComp>

          <ErrorBoundary
            fallback={<Placeholder label="Error loading tickets" />}
          >
            <Suspense fallback={<Spinner />}>
              {/* <TicketList
                userId={user?.id}
                searchParams={SearchParamsCache.parse(await searchParams)}
              /> */}
            </Suspense>
          </ErrorBoundary>
        </section>
      </Suspense>
    </div>
  );
}
