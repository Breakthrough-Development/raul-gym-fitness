export type TicketStatus = "OPEN" | "IN_PROGRESS" | "DONE";

export interface Ticket {
  id: number;
  title: string;
  content: string;
  status: TicketStatus;
}
