## Generating Static Params

How to make dynamic params pages into static pages using `generateStaticParams`.

### The Problem

Dynamic routes like `/tickets/[ticketId]` are normally rendered on-demand (ƒ Dynamic). But if we know all possible ticket IDs ahead of time, we can pre-generate static pages for better performance.

### The Solution: generateStaticParams

By implementing `generateStaticParams`, we can pre-generate static pages for all known ticket IDs at build time.

### Build Output After Implementation

```
Route (app)                                  Size  First Load JS
┌ ○ /                                       818 B         112 kB
├ ○ /_not-found                             991 B         101 kB
├ ○ /tickets                              1.39 kB         113 kB
└ ● /tickets/[ticketId]                     164 B         103 kB
    ├ /tickets/cmetwcus10000zdo6tdaksdun
    └ /tickets/cmetwcus10002zdo6ran42plv
+ First Load JS shared by all             99.6 kB
  ├ chunks/4bd1b696-cf72ae8a39fa05aa.js   54.1 kB
  ├ chunks/964-02efbd2195ef91bd.js        43.5 kB
  └ other shared chunks (total)            1.9 kB

○  (Static)  prerendered as static content
●  (SSG)     prerendered as static HTML (uses generateStaticParams)
```

**Key changes:**

- Route symbol changed from `ƒ` (Dynamic) to `●` (SSG)
- Shows actual pre-generated ticket paths
- Each ticket gets its own static HTML file

### Our Implementation

In `src/app/tickets/[ticketId]/page.tsx`:

```typescript
import TicketItem from "@/features/ticket/components/ticket-item";
import { getTicket } from "@/features/ticket/queries/get-ticket";
import { getTickets } from "@/features/ticket/queries/get-tickets";
import { notFound } from "next/navigation";

export type TicketPageProps = {
  params: Promise<{
    ticketId: string;
  }>;
};

export default async function TicketPage({ params }: TicketPageProps) {
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);
  if (!ticket) {
    return notFound();
  }
  return (
    <div className="flex justify-center animate-fade-from-top">
      <TicketItem ticket={ticket} isDetail />
    </div>
  );
}

export const generateStaticParams = async () => {
  const tickets = await getTickets();

  return tickets.map((ticket) => {
    return {
      ticketId: ticket.id,
    };
  });
};
```

### How generateStaticParams Works

1. **Build time**: Next.js calls `generateStaticParams()`
2. **Fetch data**: Function gets all tickets from database
3. **Generate params**: Returns array of param objects
4. **Pre-render pages**: Next.js renders static HTML for each ticket
5. **Serve fast**: Static files served instantly to users

### Benefits

- **Maximum performance** - Static files served from cache/CDN
- **Better SEO** - Pre-rendered HTML available to crawlers
- **Reduced server load** - No rendering on each request
- **Predictable costs** - No surprise server usage spikes

### Trade-offs

**Pros:**

- Fastest possible page loads
- Best SEO and crawling support
- Scales to millions of users with CDN

**Cons:**

- **Build time increases** - More pages to pre-generate
- **Stale data possible** - Pages cached until next build/revalidation
- **Storage requirements** - Each page creates static files

### Handling Dynamic Data

Since pages are static, we need cache invalidation for updates:

```typescript
// In delete-ticket.ts
import { revalidatePath } from "next/cache";
import { ticketPath } from "@/paths";

export const deleteTicket = async (id: string) => {
  await prisma.ticket.delete({ where: { id } });

  // Invalidate both list and detail pages
  revalidatePath("/tickets");
  revalidatePath(ticketPath(id)); // ← Also invalidate specific ticket page

  redirect(ticketsPath() as Route);
};
```

### generateStaticParams vs Dynamic Routes

#### Dynamic Route (ƒ)

```typescript
// Just the page component
export default async function TicketPage({ params }) {
  // Rendered on each request
}
```

#### Static Generation (●)

```typescript
// Page component + generateStaticParams
export default async function TicketPage({ params }) {
  // Pre-rendered at build time
}

export const generateStaticParams = async () => {
  // Tells Next.js which pages to pre-generate
  return [{ ticketId: "123" }, { ticketId: "456" }];
};
```

### Advanced Patterns

#### Partial Static Generation

```typescript
export const generateStaticParams = async () => {
  // Only pre-generate popular tickets
  const popularTickets = await getPopularTickets();
  return popularTickets.map((ticket) => ({ ticketId: ticket.id }));
};
```

#### Fallback Handling

Next.js automatically handles non-pre-generated routes:

- **Known ticket**: Serves static file instantly
- **Unknown ticket**: Renders on-demand, then caches

### Performance Impact

#### Before (Dynamic ƒ)

```
User requests /tickets/123
→ Server renders page (200-500ms)
→ Database query executed
→ HTML sent to user
```

#### After (Static ●)

```
User requests /tickets/123
→ Static file served instantly (<50ms)
→ No server rendering needed
→ No database query needed
```

### When to Use generateStaticParams

#### Use When:

- **Finite set of params** - You can enumerate all possible values
- **Performance critical** - Need fastest possible page loads
- **SEO important** - Pre-rendered content for crawlers
- **Predictable content** - Data doesn't change constantly

#### Don't Use When:

- **Infinite params** - User IDs, search queries, etc.
- **Frequently changing data** - Real-time content
- **User-specific content** - Personalized pages
- **Large param sets** - Millions of possible combinations

### Current State

Our tickets app now pre-generates static pages for all tickets:

- **Build time** - All existing tickets get static pages
- **Runtime** - New/unknown tickets render on-demand
- **Cache invalidation** - Updates trigger page regeneration
- **Best performance** - Static file serving for known tickets

This gives us the ultimate performance optimization: static page serving with on-demand fallback for comprehensive coverage.
