## Static vs Dynamic Rendering

Next.js routes can be rendered as either static or dynamic, each with different caching behaviors and performance characteristics.

### Before and After: Route Analysis

**After implementing force-dynamic** on tickets page:

```
Route (app)                                 Size  First Load JS
┌ ○ /                                      818 B         112 kB
├ ○ /_not-found                            991 B         101 kB
├ ƒ /tickets                             1.39 kB         113 kB
└ ƒ /tickets/[ticketId]                    164 B         103 kB

+ First Load JS shared by all            99.6 kB
  ├ chunks/4bd1b696-cf72ae8a39fa05aa.js  54.1 kB
  ├ chunks/964-02efbd2195ef91bd.js       43.5 kB
  └ other shared chunks (total)           1.9 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

### The Solution: Force Dynamic Rendering

We solved the stale data issue by making the tickets page dynamic:

```typescript
import Heading from "@/components/heading";
import TicketList from "@/features/ticket/components/ticket-list";
import { Spinner } from "@/components/spiner";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Placeholder from "@/components/placeholder";

export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  return (
    <section className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Tickets Page"
        description="All your tickets at one place."
      />

      <ErrorBoundary fallback={<Placeholder label="Error loading tickets" />}>
        <Suspense fallback={<Spinner />}>
          <TicketList />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
```

### How `export const dynamic = "force-dynamic"` Works

- **Forces server-side rendering** on every request
- **Bypasses full route cache** completely
- **Ensures fresh data** from database on each visit
- **Changes route from ○ (Static) to ƒ (Dynamic)**

### Static vs Dynamic Comparison

| Aspect             | Static (○)              | Dynamic (ƒ)                 |
| ------------------ | ----------------------- | --------------------------- |
| **Rendering**      | Build time              | Request time                |
| **Caching**        | Fully cached            | Not cached (or selectively) |
| **Performance**    | Fastest                 | Slower (but fresh)          |
| **Data freshness** | Stale until rebuild     | Always fresh                |
| **Use case**       | Rarely changing content | Frequently updated data     |

### Why Each Route Has Its Type

#### `/tickets` - Now Dynamic (ƒ)

- **Previously**: Static (○) - caused stale data after deletions
- **Now**: Dynamic (ƒ) - always shows fresh ticket list
- **Reason**: Ticket data changes frequently (create/update/delete)

#### `/tickets/[ticketId]` - Dynamic (ƒ)

- **Why dynamic**: Due to the dynamic route parameter `[ticketId]`
- **Behavior**: Each ticket ID creates a unique route
- **Caching**: Can be cached per ticket ID, but content is request-specific

#### `/` and `/_not-found` - Static (○)

- **Why static**: Content rarely changes
- **Behavior**: Pre-rendered at build time
- **Performance**: Maximum speed for static content

### Alternative Solutions

While `force-dynamic` solves our immediate problem, **it's not the most optimal solution**. Better alternatives include:

#### 1. Time-based Revalidation

```typescript
export const revalidate = 60; // Revalidate every 60 seconds
```

#### 2. Cache Invalidation

```typescript
// In delete action
import { revalidatePath } from "next/cache";

export const deleteTicket = async (id: string) => {
  await prisma.ticket.delete({ where: { id } });
  revalidatePath("/tickets"); // Invalidate cache
  redirect(ticketsPath() as Route);
};
```

#### 3. Tag-based Revalidation

```typescript
// Tag the data
export const getTickets = async () => {
  return await fetch("/api/tickets", {
    next: { tags: ["tickets"] },
  });
};

// Invalidate by tag
revalidateTag("tickets");
```

### Trade-offs of Force Dynamic

**Pros:**

- **Simple implementation** - just one line
- **Guaranteed fresh data** - no cache issues
- **Works immediately** - no complex cache logic

**Cons:**

- **Performance impact** - slower page loads
- **Increased server load** - renders on every request
- **No caching benefits** - loses performance optimizations

### When to Use Each Approach

#### Use Static (○) When:

- Content changes rarely (blog posts, documentation)
- Performance is critical
- Data consistency delays are acceptable

#### Use Dynamic (ƒ) When:

- Data changes frequently
- Fresh data is critical
- User-specific content

#### Use Revalidation When:

- Want both performance and freshness
- Can tolerate some staleness
- Have predictable update patterns

### Best Practices

1. **Start with static** - Default to static for better performance
2. **Use dynamic selectively** - Only for routes that truly need fresh data
3. **Consider revalidation** - Better than force-dynamic for most cases
4. **Test in production** - Development doesn't show caching behavior
5. **Monitor performance** - Measure the impact of dynamic rendering

### Current State

Our tickets app now has:

- **Fresh data guarantee** - No more stale tickets after deletion
- **Working delete flow** - Users see immediate updates
- **Performance trade-off** - Slightly slower but more reliable

**Next steps**: Consider implementing cache invalidation instead of force-dynamic for better performance while maintaining data freshness.
