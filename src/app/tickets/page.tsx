import initialTickets from "@/tickets.data";
import Link from "next/link";
import { ticketPath } from "@/paths";
import type { Route } from "next";
import clsx from "clsx";
import { Separator } from "@/components/ui/separator";
import { LucideCircleCheck, LucideFileText, LucidePencil } from "lucide-react";
import Heading from "@/components/heading";

const TICKET_ICONS = {
  OPEN: <LucideFileText />,
  IN_PROGRESS: <LucidePencil />,
  DONE: <LucideCircleCheck />,
};

export default function TicketsPage() {
  return (
    <section className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Tickets Page"
        description="All your tickets at one place."
      />

      <div>
        <ul className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
          {initialTickets.map((ticket) => (
            <li
              key={ticket.id}
              className="w-full max-w-[420px] p-4 border border-slate-100 rounded"
            >
              <div>{TICKET_ICONS[ticket.status]}</div>
              <h3 className="text-lg font-semibold truncate">{ticket.title}</h3>
              <p
                className={clsx("text-sm text-slate-500 truncate", {
                  "line-through": ticket.status === "DONE",
                })}
              >
                {ticket.content}
              </p>
              <Link href={ticketPath(ticket.id.toString()) as Route}>
                View <span className="sr-only">ticket {ticket.id}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
