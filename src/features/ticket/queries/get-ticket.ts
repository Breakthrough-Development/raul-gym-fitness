import initialTickets from "@/tickets.data";
import { Ticket } from "../types";

export async function getTicket(ticketId: number): Promise<Ticket | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return new Promise((resolve) => {
    resolve(initialTickets.find((ticket) => ticket.id === ticketId));
  });
}
