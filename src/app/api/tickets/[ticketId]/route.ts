import { getTicket } from "@/features/ticket/queries/get-ticket";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);
  if (!ticket) {
    return Response.json({ error: "Ticket not found" }, { status: 404 });
  }
  return Response.json(ticket);
}
