import Placeholder from "@/components/placeholder";
import { SearchInput } from "@/components/search-input";
import { getTickets } from "../queries/get-tickets";
import { SearchParams } from "../search-params";
import TicketItem from "./ticket-item";

export type TicketListProps = {
  userId?: string;
  searchParams: SearchParams;
};

export default async function TicketList({
  userId,
  searchParams,
}: TicketListProps) {
  const tickets = await getTickets(userId, searchParams);
  return (
    <section className="flex flex-col gap-y-4 animate-fade-from-top">
      <header className="self-center max-w-[420px] w-full">
        <h2 className="sr-only">Tickets</h2>
        <SearchInput placeholder="Search tickets" />
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
    </section>
  );
}
