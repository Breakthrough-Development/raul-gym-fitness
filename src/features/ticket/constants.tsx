import type { Ticket } from "./types";
import { LucideCircleCheck, LucideFileText, LucidePencil } from "lucide-react";

export const TICKET_STATUSES = ["OPEN", "IN_PROGRESS", "DONE"] as const;

export const EXAMPLE_TICKETS: Ticket[] = [
  {
    id: 1,
    title: "Ticket 1",
    content: "This is the first ticket",
    status: "DONE",
  },
  {
    id: 2,
    title: "Ticket 2",
    content: "This is the second ticket",
    status: "OPEN",
  },
];

export const TICKET_ICONS = {
  OPEN: <LucideFileText />,
  IN_PROGRESS: <LucidePencil />,
  DONE: <LucideCircleCheck />,
};
