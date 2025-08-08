import initialTickets from "@/tickets.data";
import Link from "next/link";

export default function TicketsPage() {
  return (
    <div>
      <ul>
        {initialTickets.map((ticket) => (
          <li key={ticket.id}>
            <h2>{ticket.title}</h2>
            <Link href={`/tickets/${ticket.id}`}>
              View <span className="sr-only">ticket {ticket.id}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
