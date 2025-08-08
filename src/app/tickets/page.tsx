import initialTickets from "@/tickets.data";
import Link from "next/link";
import { ticketPath } from "@/paths";
export default function TicketsPage() {
  return (
    <div>
      <ul>
        {initialTickets.map((ticket) => (
          <li key={ticket.id}>
            <h2>{ticket.title}</h2>
            <Link href={ticketPath(ticket.id.toString())}>
              View <span className="sr-only">ticket {ticket.id}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
