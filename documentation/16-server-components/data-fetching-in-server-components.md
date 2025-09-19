## Data Fetching in Server Components

How we fetch data in Next.js Server Components, aligned with our tickets implementation.

### What is it? (Theory)

Server Components run on the server and can fetch data directly (DB, FS, APIs) without exposing secrets. They render on the server and stream a payload to the client; only Client Components hydrate.

### Pros and Cons

- **Pros**
  - Less client JS; faster initial render
  - Direct server-only data access (safer)
  - Simple async/await colocated with UI
- **Cons**
  - Must separate Server vs Client concerns
  - Client Components still hydrate
  - Caching/invalidations matter

### Example (what we implemented)

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

- The 2s delay simulates network latency; replace with real APIs.
- Use `loading.tsx` and error boundaries to improve UX.
