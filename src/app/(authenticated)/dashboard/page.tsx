import { CardComp } from "@/components/card-comp";
import Heading from "@/components/heading";
import Placeholder from "@/components/placeholder";
import { Spinner } from "@/components/spiner";
import { ClientSearchParamsCache } from "@/features/clients/client-search-params";
import { getClients } from "@/features/clients/queries/get-clients";
import { TotalRevenueChart } from "@/features/dashboard/components/totalRevenueChart";
import { TotalSubscriptionsChart } from "@/features/dashboard/components/totalSubscriptionsChart";
import { PaymentDataTable } from "@/features/payments/components/payment-data-table";
import { PaymentPagination } from "@/features/payments/components/payment-pagination";
import { PaymentUpsertForm } from "@/features/payments/components/payment-upsert-form";
import { getPayments } from "@/features/payments/queries/get-payments";
import { PaymentSearchParamsCache } from "@/features/payments/search-params";
import { featureFlags } from "@/lib/feature-flags";
import type { Metadata } from "next";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const metadata: Metadata = {
  title: "Dashboard | Raul Gym Fitness",
  description: "Panel de control - Gestiona clientes, pagos y suscripciones",
};

type DashboardPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const cacheClientSearchParams = ClientSearchParamsCache.parse(
    await searchParams
  );
  const cachePaymentSearchParams = PaymentSearchParamsCache.parse(
    await searchParams
  );
  const [{ list: payments, metadata }, clients] = await Promise.all([
    getPayments(cachePaymentSearchParams),
    getClients({ ...cacheClientSearchParams, clientSize: 999 }),
  ]);

  const DashboardCharts = () => {
    if (!featureFlags.dashboardCharts) {
      return null;
    }
    return (
      <Suspense fallback={<Spinner />}>
        <section className="flex-1 flex flex-col gap-y-8 ">
          <Heading
            title="Cálculos automáticos"
            description="Información sobre tus clientes y sus suscripciones"
          />

          <div className="flex flex-wrap gap-6 justify-center">
            <div className="flex-1 min-w-lg max-w-2xl">
              <TotalRevenueChart />
            </div>
            <div className="flex-1 min-w-lg max-w-2xl">
              <TotalSubscriptionsChart
                title="Suscripciones diarias"
                type="DAILY"
              />
            </div>
            <div className="flex-1 min-w-lg max-w-2xl">
              <TotalSubscriptionsChart
                title="Suscripciones mensuales"
                type="MONTHLY"
              />
            </div>
          </div>
        </section>
      </Suspense>
    );
  };
  const PaymentManagement = () => {
    if (!featureFlags.paymentManagement) {
      return null;
    }
    return (
      <Suspense fallback={<Spinner />}>
        <section className="flex-1 flex flex-col gap-y-8 ">
          <Heading
            title="Página de pagos"
            description="Todos tus pagos en un solo lugar."
          />

          <CardComp
            title="Lista de pagos"
            description="Todos tus pagos en un solo lugar."
            content={<PaymentUpsertForm clients={clients.list} />}
            className="w-full max-w-[420px] self-center"
          ></CardComp>

          <ErrorBoundary
            fallback={<Placeholder label="Error al cargar los pagos" />}
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
    );
  };

  return (
    <div className="flex-1 flex flex-col gap-y-8 max-w-7xl mx-auto">
      <DashboardCharts />
      <PaymentManagement />
    </div>
  );
}
