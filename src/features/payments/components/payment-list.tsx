import { TicketPagination } from "@/features/ticket/components/ticket-pagination";
import { ParsedSearchParams } from "@/features/ticket/search-params";
import { getPayments } from "../queries/get-payments";
import { PaymentDataTable } from "./payment-data-table";

export type ClientListProps = {
  searchParams: ParsedSearchParams;
};

export async function PaymentList({ searchParams }: ClientListProps) {
  const { list: payments, metadata } = await getPayments(searchParams);
  return (
    <PaymentDataTable
      className="animate-fade-from-top"
      data={payments}
      pagination={<TicketPagination paginatedMetaData={metadata} />}
    />
  );
}
