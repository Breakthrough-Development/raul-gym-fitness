import initialTickets from "@/tickets.data";
import Link from "next/link";
import { ticketPath } from "@/paths";
import type { Route } from "next";

export default function TicketsPage() {
  return (
    <div>
      <ul>
        {initialTickets.map((ticket) => (
          <li key={ticket.id}>
            <h2>{ticket.title}</h2>
            <Link href={ticketPath(ticket.id.toString()) as Route}>
              View <span className="sr-only">ticket {ticket.id}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
