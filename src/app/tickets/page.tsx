"use client";
import Heading from "@/components/heading";
import TicketItem from "@/features/ticket/components/ticket-item";
import { Ticket } from "@/features/ticket/types";
import { useEffect, useState } from "react";
import { getTickets } from "@/features/ticket/queries/get-tickets";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const tickets = await getTickets();
      setTickets(tickets);
    };
    fetchTickets();
  }, []);

  return (
    <section className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Tickets Page"
        description="All your tickets at one place."
      />

      <div>
        <ul className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
          {tickets.map((ticket) => (
            <TicketItem key={ticket.id} ticket={ticket} />
          ))}
        </ul>
      </div>
    </section>
  );
}
