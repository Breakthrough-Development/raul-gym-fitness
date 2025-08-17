import initialTickets from "@/tickets.data";
import Link from "next/link";
import { ticketsPath } from "@/paths";
import type { Route } from "next";
import Placeholder from "@/components/placeholder";
import { Button } from "@/components/ui/button";

export type TicketPageProps = {
  params: {
    ticketId: string;
  };
};

export default function TicketPage({ params }: TicketPageProps) {
  const ticketId = Number(params.ticketId);
  const ticket = initialTickets.find((ticket) => ticket.id === ticketId);
  if (!ticket) {
    return (
      <Placeholder
        label="Ticket not found"
        button={
          <Button asChild variant="outline">
            <Link href={ticketsPath() as Route}>Back to tickets</Link>
          </Button>
        }
      />
    );
  }
  return (
    <section>
      <h2>{ticket.title}</h2>
      <p>{ticket.content}</p>
      <p>{ticket.status}</p>
      <Link href={ticketsPath() as Route}>Back to tickets page</Link>
    </section>
  );
}
