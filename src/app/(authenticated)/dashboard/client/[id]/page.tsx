import Heading from "@/components/heading";
import Placeholder from "@/components/placeholder";
import { ClientItem } from "@/features/clients/components/client-item";
import { getClient } from "@/features/clients/queries/get-client";
import { PaymentDataTable } from "@/features/payments/components/payment-data-table";
import { PaymentPagination } from "@/features/payments/components/payment-pagination";
import { getPaymentsByClient } from "@/features/payments/queries/get-payments-by-client";
import { PaymentSearchParamsCache } from "@/features/payments/search-params";
import { featureFlags } from "@/lib/feature-flags";
import { homePath } from "@/paths";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

type ClientDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const client = await getClient(id);

  if (!client) {
    return {
      title: "Cliente no encontrado | Raul Gym Fitness",
      description: "El cliente solicitado no fue encontrado",
    };
  }

  const clientName = `${client.firstName} ${client.lastName}`.trim();

  return {
    title: `${clientName} | Raul Gym Fitness`,
    description: `Detalles del cliente ${clientName} e historial de pagos`,
  };
}

export default async function ClientDetailPage({
  params,
  searchParams,
}: ClientDetailPageProps) {
  if (!featureFlags.clientManagement) {
    redirect(homePath());
  }
  const { id } = await params;
  const client = await getClient(id);
  const parsedPaymentSearchParams = PaymentSearchParamsCache.parse(
    await searchParams
  );
  const { list: payments, metadata } = await getPaymentsByClient(
    id,
    parsedPaymentSearchParams
  );

  if (!client) {
    return <Placeholder label="Cliente no encontrado" />;
  }

  const ClientHeader = () => (
    <Heading
      title="Cliente"
      description="Detalles del cliente e historial de pagos"
    />
  );

  const ClientInfoSection = () => <ClientItem client={client} isDetail />;

  const ClientPaymentsSection = () => (
    <PaymentDataTable
      className="animate-fade-from-top"
      data={payments}
      pagination={<PaymentPagination paginatedMetaData={metadata} />}
      clients={[client]}
    />
  );

  return (
    <section className="flex-1 flex flex-col gap-y-8 max-w-7xl mx-auto">
      <ClientHeader />
      <ClientInfoSection />
      <ClientPaymentsSection />
    </section>
  );
}
