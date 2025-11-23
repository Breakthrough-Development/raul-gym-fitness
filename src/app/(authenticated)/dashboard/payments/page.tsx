import { CardComp } from "@/components/card-comp";
import Heading from "@/components/heading";
import Placeholder from "@/components/placeholder";
import { Spinner } from "@/components/spiner";
import { ClientSearchParamsCache } from "@/features/clients/client-search-params";
import { getClients } from "@/features/clients/queries/get-clients";
import { PaymentDataTable } from "@/features/payments/components/payment-data-table";
import { PaymentPagination } from "@/features/payments/components/payment-pagination";
import { PaymentUpsertForm } from "@/features/payments/components/payment-upsert-form";
import { getPayments } from "@/features/payments/queries/get-payments";
import { PaymentSearchParamsCache } from "@/features/payments/search-params";
import { featureFlags } from "@/lib/feature-flags";
import { homePath } from "@/paths";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const metadata: Metadata = {
  title: "Pagos | Raul Gym Fitness",
  description: "Gestiona y visualiza todos los pagos de tus clientes",
};

type PaymentPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function PaymentsPage({ searchParams }: PaymentPageProps) {
  if (!featureFlags.paymentManagement) {
    redirect(homePath());
  }

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

  const PaymentHeader = () => (
    <Heading
      title="Página de pagos"
      description="Todos tus pagos en un solo lugar."
    />
  );

  const PaymentUpsertSection = () => (
    <CardComp
      title="Lista de pagos"
      description="Todos tus pagos en un solo lugar."
      content={<PaymentUpsertForm clients={clients.list} />}
      className="w-full max-w-[420px] self-center"
    />
  );

  const PaymentListSection = () => (
    <ErrorBoundary fallback={<Placeholder label="Error al cargar los pagos" />}>
      <Suspense fallback={<Spinner />}>
        <PaymentDataTable
          className="animate-fade-from-top"
          data={payments}
          pagination={<PaymentPagination paginatedMetaData={metadata} />}
          clients={clients.list}
        />
      </Suspense>
    </ErrorBoundary>
  );

  return (
    <Suspense fallback={<Spinner />}>
      <section className="flex-1 flex flex-col gap-y-8 ">
        <PaymentHeader />
        <PaymentUpsertSection />
        <PaymentListSection />
      </section>
    </Suspense>
  );
}
