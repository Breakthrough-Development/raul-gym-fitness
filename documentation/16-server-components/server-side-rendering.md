## Server-Side Rendering (SSR) for Tickets

This app renders tickets on the server using Next.js Server Components. Pages fetch data on the server, render HTML, and send it to the client.

### What is SSR? (Theory)

Server-Side Rendering generates HTML on the server per request, often with data already loaded. In the Next.js App Router, Server Components can fetch data directly on the server and stream HTML to the client, while Client Components hydrate only where interactivity is needed.

### What we implemented

- **Async server pages**: `tickets` list and `[ticketId]` detail are `async` and can `await` data.
- **Server data fetching**: `getTickets()` and `getTicket()` run on the server. Each simulates a 2s API delay.
- **Graceful empty states**: Missing ticket returns a `Placeholder` with a link back to the list.

### How it works (at a glance)

```tsx
// src/app/tickets/page.tsx
export default async function TicketsPage() {
  const tickets = await getTickets();
  return (
    <ul>
      {tickets.map((t) => (
        <TicketItem key={t.id} ticket={t} />
      ))}
    </ul>
  );
}
```

```tsx
// src/app/tickets/[ticketId]/page.tsx
import { notFound } from "next/navigation";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  const ticket = await getTicket(Number(ticketId));
  if (!ticket) return notFound();
  return <TicketItem ticket={ticket} isDetail />;
}
```

```tsx
// src/features/ticket/queries/get-tickets.ts
export const getTickets = async () => {
  await new Promise((r) => setTimeout(r, 2000));
  return initialTickets;
};
```

```tsx
// src/features/ticket/queries/get-ticket.ts
export async function getTicket(id: number) {
  await new Promise((r) => setTimeout(r, 2000));
  return initialTickets.find((t) => t.id === id);
}
```

### Pros and Cons

- **Pros**
  - Faster first paint and better SEO (HTML ships with data)
  - Less client-side JavaScript (no `useEffect` for initial load)
  - Simpler code paths (data fetching colocated with the page)
  - Safe server-only access to secrets and private APIs
- **Cons**
  - Higher server load and potentially higher infra costs
  - Increased TTFB due to server work and network round trips
  - Browser-only APIs unavailable in Server Components; mix with Client Components
  - Caching strategy becomes more important/complex

### Key files

- `src/app/tickets/page.tsx`
- `src/app/tickets/[ticketId]/page.tsx`
- `src/features/ticket/queries/get-tickets.ts`
- `src/features/ticket/queries/get-ticket.ts`

### Folder structure (relevant parts)

```
src/
├── app/
│   └── tickets/
│       ├── page.tsx
│       └── [ticketId]/
│           └── page.tsx
└── features/
    └── ticket/
        ├── components/
        │   └── ticket-item.tsx
        ├── queries/
        │   ├── get-tickets.ts
        │   └── get-ticket.ts
        └── types.ts
```

### Notes

- The 2s delay is for demo only; replace with real API calls in production.
- Consider adding `loading.tsx` and error boundaries for enhanced UX.
