import initialTickets from "@/app/tickets.data";
import Link from "next/link";

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
      <section>
        <h1>Ticket not found</h1>
        <Link href="/tickets">Back to tickets page</Link>
      </section>
    );
  }
  return (
    <section>
      <h2>{ticket.title}</h2>
      <p>{ticket.content}</p>
      <p>{ticket.status}</p>
      <Link href="/tickets">Back to tickets page</Link>
    </section>
  );
}
