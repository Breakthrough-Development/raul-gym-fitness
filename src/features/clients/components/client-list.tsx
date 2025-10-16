import Placeholder from "@/components/placeholder";
import { TicketPagination } from "@/features/ticket/components/ticket-pagination";
import { TicketSearchInput } from "@/features/ticket/components/ticket-search-input";
import { TicketSortSelect } from "@/features/ticket/components/ticket-sort-select";
import { TicketParsedSearchParams } from "@/features/ticket/ticket-search-params";
import { SORT_OPTIONS } from "../constants";
import { getClients } from "../queries/get-clients";
import { ClientItem } from "./client-item";

export type ClientListProps = {
  searchParams: TicketParsedSearchParams;
};

export async function ClientList({ searchParams }: ClientListProps) {
  const { list: clients, metadata } = await getClients(searchParams);
  return (
    <section className="flex flex-col gap-y-4 animate-fade-from-top">
      <header className="self-center max-w-[420px] w-full flex gap-x-2">
        <h2 className="sr-only">Clients</h2>
        <TicketSearchInput placeholder="Search clients by name" />
        <TicketSortSelect options={SORT_OPTIONS} />
      </header>
      <ul className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
        {clients.length ? (
          clients.map((client) => (
            <ClientItem key={client.id} client={client} />
          ))
        ) : (
          <Placeholder label="No clients found" />
        )}
      </ul>
      <footer className="w-full max-w-[420px] self-center">
        <TicketPagination paginatedMetaData={metadata} />
      </footer>
    </section>
  );
}
