import Heading from "@/components/heading";
import Placeholder from "@/components/placeholder";
import { ClientItem } from "@/features/clients/components/client-item";
import { getClient } from "@/features/clients/queries/get-client";
import { PaymentDataTable } from "@/features/payments/components/payment-data-table";
import { PaymentPagination } from "@/features/payments/components/payment-pagination";
import { getPaymentsByClient } from "@/features/payments/queries/get-payments-by-client";
import { PaymentSearchParamsCache } from "@/features/payments/search-params";

type ClientDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ClientDetailPage({
  params,
  searchParams,
}: ClientDetailPageProps) {
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
    return <Placeholder label="Client not found" />;
  }

  return (
    <section className="flex-1 flex flex-col gap-y-8 max-w-7xl mx-auto">
      <Heading
        title="Client"
        description="Client details and payment history"
      />
      <ClientItem client={client} isDetail />
      <PaymentDataTable
        className="animate-fade-from-top"
        data={payments}
        pagination={<PaymentPagination paginatedMetaData={metadata} />}
        clients={[client]}
      />
    </section>
  );
}
