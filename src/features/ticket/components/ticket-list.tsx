import Placeholder from "@/components/placeholder";
import { SORT_OPTIONS } from "../constants";
import { getTickets } from "../queries/get-tickets";
import { TicketParsedSearchParams } from "../ticket-search-params";
import TicketItem from "./ticket-item";
import { TicketPagination } from "./ticket-pagination";
import { TicketSearchInput } from "./ticket-search-input";
import { TicketSortSelect } from "./ticket-sort-select";

export type TicketListProps = {
  userId?: string;
  searchParams: TicketParsedSearchParams;
};

export default async function TicketList({
  userId,
  searchParams,
}: TicketListProps) {
  const { list: tickets, metadata } = await getTickets(userId, searchParams);

  return (
    <section className="flex flex-col gap-y-4 animate-fade-from-top">
      <header className="self-center max-w-[420px] w-full flex gap-x-2">
        <h2 className="sr-only">Tickets</h2>
        <TicketSearchInput placeholder="Search tickets" />
        <TicketSortSelect options={SORT_OPTIONS} />
      </header>
      <ul className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
        {tickets.length ? (
          tickets.map((ticket) => (
            <TicketItem key={ticket.id} ticket={ticket} />
          ))
        ) : (
          <Placeholder label="No tickets found" />
        )}
      </ul>
      <footer className="w-full max-w-[420px] self-center">
        <TicketPagination paginatedMetaData={metadata} />
      </footer>
    </section>
  );
}
