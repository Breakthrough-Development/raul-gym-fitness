## Full Route Cache

The Full Route Cache is a server-side cache that stores the rendered result of routes. It's part of Next.js's "hard" cache system and provides significant performance benefits by serving pre-rendered content.

### How It Works

When a route is rendered, Next.js stores the complete HTML output on the server. Subsequent requests for the same route serve the cached version instead of re-rendering.

```
                    Caching in Next.js
                           |
          ┌────────────────┴────────────────┐
          │                                 │
    Client-Side Cache                Server-Side Cache
      "Soft" Cache                    "Hard" Cache
          │                                 │
    ┌─────┴─────┐                    ┌─────┴─────┐
    │           │                    │           │
Router Cache  [Other]          Full Route Cache [Other]
```

### Route Types in Production

Next.js classifies routes based on their caching behavior:

```
Route (app)                                 Size  First Load JS
┌ ○ /                                      818 B         112 kB
├ ○ /_not-found                            991 B         101 kB
├ ○ /tickets                             1.39 kB         113 kB
└ ƒ /tickets/[ticketId]                    164 B         103 kB
+ First Load JS shared by all            99.6 kB
  ├ chunks/4bd1b696-cf72ae8a39fa05aa.js  54.1 kB
  ├ chunks/964-02efbd2195ef91bd.js       43.5 kB
  └ other shared chunks (total)           1.9 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

#### Route Symbols

- **○ (Static)** - Prerendered as static content, fully cached
- **ƒ (Dynamic)** - Server-rendered on demand, can be cached but more flexible

### The Problem in Our App

**Issue**: Our tickets page doesn't update when we delete a ticket from `/tickets/[ticketId]`.

**Root Cause**: The `/tickets` route is being fully cached (○ Static), so:

1. User deletes a ticket on detail page
2. Redirect goes to `/tickets`
3. Cached version still shows the deleted ticket
4. Only rebuilding and restarting shows updated data

### Why This Happens

```
Request Flow with Full Route Cache:
1. User visits /tickets → Server renders page → Cache stores result
2. User deletes ticket → Database updated → Cache unchanged
3. User returns to /tickets → Cache serves old version → Stale data shown
```

### Static vs Dynamic Routes

#### Static Routes (○)

- **Pre-rendered at build time**
- **Fully cached** until next deployment
- **Maximum performance** but data can become stale
- **Good for**: Content that rarely changes

#### Dynamic Routes (ƒ)

- **Rendered on each request**
- **Can be cached** but more flexible with invalidation
- **Fresh data** but potentially slower
- **Good for**: Frequently changing content

### Solutions for Our Tickets App

#### 1. Force Dynamic Rendering

```typescript
// src/app/tickets/page.tsx
export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  const tickets = await getTickets();
  // Rest of component...
}
```

#### 2. Use Revalidation

```typescript
// Revalidate every 60 seconds
export const revalidate = 60;

export default async function TicketsPage() {
  const tickets = await getTickets();
  // Rest of component...
}
```

#### 3. Cache Invalidation in Server Actions

```typescript
import { revalidatePath } from "next/cache";

export const deleteTicket = async (id: string) => {
  await prisma.ticket.delete({ where: { id } });

  // Invalidate the cache
  revalidatePath("/tickets");
  redirect(ticketsPath() as Route);
};
```

#### 4. Tag-Based Revalidation

```typescript
// In queries
export const getTickets = async () => {
  return await fetch("/api/tickets", {
    next: { tags: ["tickets"] },
  });
};

// In server actions
import { revalidateTag } from "next/cache";

export const deleteTicket = async (id: string) => {
  await prisma.ticket.delete({ where: { id } });
  revalidateTag("tickets");
  redirect(ticketsPath() as Route);
};
```

### Best Practices

- **Understand your data patterns** - Static for stable content, dynamic for changing data
- **Use revalidation** for time-sensitive but cacheable content
- **Implement cache invalidation** for immediate updates after mutations
- **Test in production** to see actual caching behavior
- **Monitor performance** vs freshness trade-offs

### Cache Invalidation Strategies

1. **Time-based** - Revalidate after fixed intervals
2. **On-demand** - Invalidate when data changes
3. **Tag-based** - Group related cache entries
4. **Path-based** - Invalidate specific routes

### Current State

Our app currently has `/tickets` as a static route, causing stale data issues. We need to implement one of the solutions above to ensure users see fresh data after deletions.
