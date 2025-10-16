import { TicketPagination } from "@/features/ticket/components/ticket-pagination";
import { TicketSearchInput } from "@/features/ticket/components/ticket-search-input";
import { TicketSortSelect } from "@/features/ticket/components/ticket-sort-select";
import { ParsedSearchParams } from "@/features/ticket/search-params";
import { DataTable } from "../../../components/data-table";
import { SORT_OPTIONS } from "../constants";
import { getPayments } from "../queries/get-payments";

export type ClientListProps = {
  searchParams: ParsedSearchParams;
};

export async function PaymentList({ searchParams }: ClientListProps) {
  const { list: payments, metadata } = await getPayments(searchParams);
  return (
    <section className="flex flex-col gap-y-4 animate-fade-from-top">
      <DataTable data={payments} />
      <header className="self-center max-w-[420px] w-full flex gap-x-2">
        <h2 className="sr-only">Payments</h2>
        <TicketSearchInput placeholder="Search payments by client's name" />
        <TicketSortSelect options={SORT_OPTIONS} />
      </header>
      <ul className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
        {JSON.stringify(payments, null, 2)}
      </ul>
      <footer className="w-full max-w-[420px] self-center">
        <TicketPagination paginatedMetaData={metadata} />
      </footer>
    </section>
  );
}
