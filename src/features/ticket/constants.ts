import type { Ticket } from "./types";

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
