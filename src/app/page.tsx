import { CardComp } from "@/components/card-comp";
import Heading from "@/components/heading";
import Placeholder from "@/components/placeholder";
import { Spinner } from "@/components/spiner";
import { ClientSearchParamsCache } from "@/features/clients/client-search-params";
import { ClientList } from "@/features/clients/components/client-list";
import { ClientUpsertForm } from "@/features/clients/components/client-upsert-form";
import { getClients } from "@/features/clients/queries/get-clients";
import { TotalRevenueChart } from "@/features/dashboard/components/totalRevenueChart";
import { TotalSubscriptionsChart } from "@/features/dashboard/components/totalSubscriptionsChart";
import { PaymentDataTable } from "@/features/payments/components/payment-data-table";
import { PaymentPagination } from "@/features/payments/components/payment-pagination";
import { PaymentUpsertForm } from "@/features/payments/components/payment-upsert-form";
import { getPayments } from "@/features/payments/queries/get-payments";
import { PaymentSearchParamsCache } from "@/features/payments/search-params";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type HomePageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const cacheClientSearchParams = ClientSearchParamsCache.parse(
    await searchParams
  );
  const cachePaymentSearchParams = PaymentSearchParamsCache.parse(
    await searchParams
  );
  const [{ list: payments, metadata }, clients] = await Promise.all([
    getPayments(cachePaymentSearchParams),
    getClients({ ...cacheClientSearchParams, size: 999 }),
  ]);

  return (
    <div className="flex-1 flex flex-col gap-y-8 max-w-7xl mx-auto">
      <Heading title="Home" description="Your home place to start" />

      <Suspense fallback={<Spinner />}>
        <section className="flex flex-wrap gap-6 justify-center">
          <h2 className="sr-only text-3xl font-bold tracking-tight">
            Automatic Calculations
          </h2>
          <div className="flex-1 min-w-lg max-w-2xl">
            <TotalRevenueChart />
          </div>
          <div className="flex-1 min-w-lg max-w-2xl">
            <TotalSubscriptionsChart title="Daily Subscriptions" type="DAILY" />
          </div>
          <div className="flex-1 min-w-lg max-w-2xl">
            <TotalSubscriptionsChart
              title="Monthly Subscriptions"
              type="MONTHLY"
            />
          </div>
        </section>
      </Suspense>

      <Suspense fallback={<Spinner />}>
        <section className="flex-1 flex flex-col gap-y-8 ">
          <Heading
            title="Clients Page"
            description="All your Clients at one place."
          />

          <CardComp
            title="Payment list"
            description="All your payments in one place."
            content={<PaymentUpsertForm clients={clients.list} />}
            className="w-full max-w-[420px] self-center"
          ></CardComp>

          <ErrorBoundary
            fallback={<Placeholder label="Error loading payments" />}
          >
            <Suspense fallback={<Spinner />}>
              <PaymentDataTable
                className="animate-fade-from-top"
                data={payments}
                pagination={<PaymentPagination paginatedMetaData={metadata} />}
                clients={clients.list}
              />
            </Suspense>
          </ErrorBoundary>
        </section>
      </Suspense>

      <Suspense fallback={<Spinner />}>
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
                searchParams={ClientSearchParamsCache.parse(await searchParams)}
              ></ClientList>
            </Suspense>
          </ErrorBoundary>
        </section>
      </Suspense>
    </div>
  );
}
