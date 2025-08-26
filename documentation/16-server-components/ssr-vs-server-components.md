## SSR vs Server Components

This document clarifies the differences between traditional Server-Side Rendering (SSR) and React Server Components (RSC) in Next.js, using our tickets implementation as the example.

### What are they? (Theory)

- **SSR**: React renders HTML on the server per request, sends HTML + JS to the client, and the client hydrates to enable interactivity.
- **Server Components (RSC)**: Components that run only on the server. The server streams a special payload describing the rendered tree. Server Components are not hydrated; nested Client Components are.

### Pros and Cons

- **SSR Pros**
  - Strong SEO and fast first paint
  - Works with existing React patterns
- **SSR Cons**
  - Hydrates larger trees; more client JavaScript
  - Boilerplate-y data fetching patterns
- **Server Components Pros**
  - Less client JS; faster starts and smaller bundles
  - Direct server-only data access (safer, simpler)
  - Enables streaming and better caching primitives
- **Server Components Cons**
  - Requires clear Server/Client boundaries
  - Client Components inside still hydrate
  - Caching/invalidation strategy matters

### Example (what we implemented)

We use Server Components for tickets. Pages are `async` and fetch on the server.

```tsx
// src/app/tickets/page.tsx
import Heading from "@/components/heading";
import TicketItem from "@/features/ticket/components/ticket-item";
import { getTickets } from "@/features/ticket/queries/get-tickets";

export default async function TicketsPage() {
  const tickets = await getTickets();
  return (
    <section className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Tickets Page"
        description="All your tickets at one place."
      />
      <div>
        <ul className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
          {tickets.map((ticket) => (
            <TicketItem key={ticket.id} ticket={ticket} />
          ))}
        </ul>
      </div>
    </section>
  );
}
```

```tsx
// src/app/tickets/[ticketId]/page.tsx
import { notFound } from "next/navigation";
import TicketItem from "@/features/ticket/components/ticket-item";
import { getTicket } from "@/features/ticket/queries/get-ticket";

export type TicketPageProps = { params: Promise<{ ticketId: string }> };

export default async function TicketPage({ params }: TicketPageProps) {
  const { ticketId } = await params;
  const ticket = await getTicket(Number(ticketId));
  if (!ticket) return notFound();
  return (
    <div className="flex justify-center animate-fade-from-top">
      <TicketItem ticket={ticket} isDetail />
    </div>
  );
}
```

```tsx
// src/features/ticket/queries/get-tickets.ts
import initialTickets from "@/tickets.data";
import { Ticket } from "../types";

export const getTickets = async (): Promise<Ticket[]> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return initialTickets;
};
```

```tsx
// src/features/ticket/queries/get-ticket.ts
import initialTickets from "@/tickets.data";
import { Ticket } from "../types";

export async function getTicket(id: number): Promise<Ticket | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return initialTickets.find((t) => t.id === id);
}
```

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

- Server Components are not hydrated; Client Components are.
- The 2s delay is demo-only; replace with real APIs in production.
- Consider `loading.tsx` and error boundaries for better UX.
