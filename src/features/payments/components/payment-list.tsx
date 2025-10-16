import { TicketPagination } from "@/features/ticket/components/ticket-pagination";
import { ParsedSearchParams } from "@/features/ticket/search-params";
import { DataTable } from "../../../components/data-table";
import { getPayments } from "../queries/get-payments";

export type ClientListProps = {
  searchParams: ParsedSearchParams;
};

export async function PaymentList({ searchParams }: ClientListProps) {
  const { list: payments, metadata } = await getPayments(searchParams);
  return (
    <DataTable
      className="animate-fade-from-top"
      data={payments}
      pagination={<TicketPagination paginatedMetaData={metadata} />}
    />
  );
}
