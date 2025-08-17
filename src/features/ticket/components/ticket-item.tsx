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
import { Button } from "@/components/ui/button";
import { LucideSquareArrowOutUpRight } from "lucide-react";
import clsx from "clsx";

export type TicketItemProps = {
  ticket: Ticket;
  isDetail?: boolean;
};

const TicketItem = ({ ticket, isDetail }: TicketItemProps) => {
  const detailButton = (
    <Button asChild variant="outline" size="icon">
      <Link href={ticketPath(ticket.id.toString()) as Route}>
        <LucideSquareArrowOutUpRight className="h-4 w-4" />
        <span className="sr-only">View ticket {ticket.id}</span>
      </Link>
    </Button>
  );
  return (
    <div
      className={clsx("w-full flex gap-x-1", {
        "max-w-[580px]": isDetail,
        "max-w-[420px]": !isDetail,
      })}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex gap-x-2">
            <span>{TICKET_ICONS[ticket.status]}</span>
            <span className="truncate">{ticket.title}</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <span
            className={clsx("whitespace-break-spaces", {
              "line-clamp-3": !isDetail,
            })}
          >
            {ticket.content}
          </span>
        </CardContent>
      </Card>
      {!isDetail && <div className="flex flex-col gap-y-1">{detailButton}</div>}
    </div>
  );
};

export default TicketItem;
