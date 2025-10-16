import { getTickets } from "@/features/ticket/queries/get-tickets";
import { TicketSearchParamsCache } from "@/features/ticket/ticket-search-params";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const untypedSearchParams = Object.fromEntries(searchParams);
  const typedSearchParams = TicketSearchParamsCache.parse(untypedSearchParams);
  const { list, metadata } = await getTickets(undefined, typedSearchParams);

  return Response.json({ list, metadata });
}
