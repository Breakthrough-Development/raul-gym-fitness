import Link from "next/link";
import { ticketPath } from "@/paths";
import type { Route } from "next";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TICKET_ICONS } from "../constants";
import type { Ticket } from "../types";

export type TicketItemProps = {
  ticket: Ticket;
};

const TicketItem = ({ ticket }: TicketItemProps) => {
  return (
    <Card key={ticket.id} className="w-full max-w-[420px]">
      <CardHeader>
        <CardTitle className="flex gap-x-2">
          <span>{TICKET_ICONS[ticket.status]}</span>
          <span className="truncate">{ticket.title}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="text-sm text-slate-500 truncate">
        <span className="line-clamp-3 whitespace-break-spaces">
          {ticket.content}
        </span>
      </CardContent>

      <CardFooter>
        <Link
          href={ticketPath(ticket.id.toString()) as Route}
          className="underline"
        >
          View <span className="sr-only">ticket {ticket.id}</span>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TicketItem;
