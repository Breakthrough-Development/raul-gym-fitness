## Not Found (404) in the App Router

In the App Router, you can trigger a 404 for a route by calling `notFound()` from `next/navigation`. You then provide a route-segment-level `not-found.tsx` file that renders the 404 UI for that segment.

### What we implemented

On the Ticket detail page, we return a 404 when the requested ticket does not exist. The 404 UI is handled by a segment-level `not-found.tsx` file colocated with the route.

```tsx
// src/app/tickets/[ticketId]/page.tsx
import TicketItem from "@/features/ticket/components/ticket-item";
import { getTicket } from "@/features/ticket/queries/get-ticket";
import { notFound } from "next/navigation";

export type TicketPageProps = {
  params: Promise<{ ticketId: string }>;
};

export default async function TicketPage({ params }: TicketPageProps) {
  const { ticketId } = await params;
  const ticket = await getTicket(Number(ticketId));
  if (!ticket) {
    return notFound();
  }

  return (
    <div className="flex justify-center animate-fade-from-top">
      <TicketItem ticket={ticket} isDetail />
    </div>
  );
}
```

The segment-level `not-found.tsx` provides the UI that is shown whenever `notFound()` is called within this segment (or when a matching dynamic segment cannot be resolved):

```tsx
// src/app/tickets/[ticketId]/not-found.tsx
import Link from "next/link";
import { ticketsPath } from "@/paths";
import type { Route } from "next";
import Placeholder from "@/components/placeholder";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Placeholder
      label="Ticket not found"
      button={
        <Button asChild variant="outline">
          <Link href={ticketsPath() as Route}>Back to tickets</Link>
        </Button>
      }
    />
  );
}
```

### How it works

- **Trigger**: Call `notFound()` inside a Server Component or loader logic to bail out and render the closest `not-found.tsx` in the route hierarchy.
- **Scope**: The `not-found.tsx` resolves from the most specific segment upwards. You can add a global `app/not-found.tsx` as a catch-all.
- **Streaming-friendly**: `notFound()` short-circuits rendering for that request and returns a 404 response with your custom UI.

### When to use `notFound()` vs Error Boundaries

- Use **`notFound()`** for missing resources (e.g., record by ID not found).
- Use **Error Boundaries** (e.g., `error.tsx` or component-level boundaries) for unexpected errors during render or data fetching.

### Tips

- Keep the `not-found.tsx` UI minimal and fast; it should render instantly.
- Provide a clear recovery action (e.g., a button back to the listing page).
- If multiple dynamic segments can fail to match, each segment can define its own `not-found.tsx` for more contextual messaging.

### Further reading

- App Router not-found docs: `https://nextjs.org/docs/app/api-reference/file-conventions/not-found`
