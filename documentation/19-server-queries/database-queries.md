## Database Queries

Created database query functions to replace the mock data with real database operations using Prisma.

### Query Functions

#### Get All Tickets

`src/features/ticket/queries/get-tickets.ts`:

```typescript
import { prisma } from "@/lib/prisma";

export const getTickets = async () => {
  return await prisma.ticket.findMany({
    orderBy: {
      createAt: "desc",
    },
  });
};
```

#### Get Single Ticket

`src/features/ticket/queries/get-ticket.ts`:

```typescript
import { prisma } from "@/lib/prisma";

export async function getTicket(id: string) {
  return await prisma.ticket.findUnique({
    where: {
      id,
    },
  });
}
```

### Usage in Pages

#### Ticket Detail Page

Updated `src/app/tickets/[ticketId]/page.tsx` to use real database queries:

```typescript
import { getTicket } from "@/features/ticket/queries/get-ticket";
import { notFound } from "next/navigation";

export default async function TicketPage({ params }: TicketPageProps) {
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);

  if (!ticket) {
    return notFound(); // Shows 404 page for missing tickets
  }

  return (
    <div className="flex justify-center animate-fade-from-top">
      <TicketItem ticket={ticket} isDetail />
    </div>
  );
}
```

### Benefits

- **Type Safety** - Prisma provides full TypeScript types
- **Real Data** - No more mock data, using actual database
- **Error Handling** - Proper 404 handling for missing tickets
- **Performance** - Optimized queries with ordering and filtering
- **Server Components** - Queries run on the server, improving performance

### What's Replaced

- Replaced mock data from `src/tickets.data.ts`
- Server Components now fetch real data from database
- Proper error handling for missing resources
- Type-safe database operations
