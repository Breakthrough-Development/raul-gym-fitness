import Heading from "@/components/heading";
import TicketList from "@/features/ticket/components/ticket-list";
import { Spinner } from "@/components/spiner";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Placeholder from "@/components/placeholder";

export const revalidate = 30;
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

## Time-Based Cache (ISR - Incremental Static Regeneration)

Time-based caching allows you to have the benefits of static generation while ensuring content stays fresh by automatically revalidating at specified intervals.

### What is ISR?

Incremental Static Regeneration (ISR) lets you:

- **Serve static content** for fast performance
- **Automatically update** the cache at timed intervals
- **Balance performance and freshness** without manual intervention

### Our Implementation

We replaced `force-dynamic` with time-based revalidation:

```typescript
import Heading from "@/components/heading";
import TicketList from "@/features/ticket/components/ticket-list";
import { Spinner } from "@/components/spiner";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Placeholder from "@/components/placeholder";

export const revalidate = 30; // ← Key addition

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

### How `export const revalidate = 30` Works

- **Makes the page static** with automatic cache invalidation
- **Revalidates every 30 seconds** - regenerates the page with fresh data
- **Page-level configuration** - applies to the entire route
- **Better than force-dynamic** - combines performance with freshness

### Revalidate Values and Behavior

```typescript
export const revalidate = 30; // Revalidate every 30 seconds
export const revalidate = 60; // Revalidate every 60 seconds
export const revalidate = 300; // Revalidate every 5 minutes
export const revalidate = 0; // Becomes dynamic (same as force-dynamic)
export const revalidate = false; // Never revalidate (static forever)
```

### ISR Request Flow

```
First Request:
User → Server renders page → Cache stores result → Serve to user

Within 30 seconds:
User → Cached version served immediately → Fast response

After 30 seconds:
User → Cached version served → Background: Server regenerates → Cache updated
Next User → Fresh cached version served
```

### Benefits of Our Current Setup

**Performance:**

- **Fast initial load** - serves cached version immediately
- **Background updates** - regeneration doesn't block requests
- **Reduced server load** - not every request triggers rendering

**Data Freshness:**

- **Regular updates** - content refreshes every 30 seconds
- **Eventually consistent** - users get fresh data within the time window
- **No stale data forever** - guaranteed freshness unlike pure static

### Comparison: ISR vs Force Dynamic

| Aspect              | ISR (revalidate: 30)    | Force Dynamic              |
| ------------------- | ----------------------- | -------------------------- |
| **Performance**     | Fast (cached)           | Slower (always renders)    |
| **Data freshness**  | Fresh within 30s        | Always fresh               |
| **Server load**     | Low                     | High                       |
| **User experience** | Fast + eventually fresh | Slower + immediately fresh |
| **Best for**        | Most use cases          | Critical real-time data    |

### Choosing Revalidation Time

**Shorter intervals (5-30 seconds):**

- More fresh data
- Slightly more server load
- Good for frequently changing content

**Longer intervals (5-60 minutes):**

- Better performance
- Less server load
- Good for moderately changing content

**For our tickets app:**

- **30 seconds** is a good balance
- Users see changes within reasonable time
- Performance remains excellent

### When ISR Might Not Be Enough

ISR works great for most cases, but consider alternatives when:

- **Immediate consistency required** - financial data, inventory
- **User-specific content** - personalized dashboards
- **Real-time features** - chat, live updates

### Alternative: On-Demand Revalidation

For immediate updates after mutations:

```typescript
// In server actions
import { revalidatePath } from "next/cache";

export const deleteTicket = async (id: string) => {
  await prisma.ticket.delete({ where: { id } });

  // Immediately invalidate cache
  revalidatePath("/tickets");
  redirect(ticketsPath() as Route);
};
```

### Best Practices

1. **Start with ISR** - Good default for most applications
2. **Choose appropriate intervals** - Based on data change frequency
3. **Combine with on-demand** - ISR for regular updates + manual for immediate needs
4. **Monitor performance** - Adjust intervals based on usage patterns
5. **Test in production** - ISR behavior only visible in production builds

### Current State

Our tickets app now uses ISR with 30-second revalidation:

- **Better performance** than force-dynamic
- **Fresh data** within 30 seconds
- **Optimal balance** for our use case
- **Scalable solution** for production

This approach provides the best of both worlds: static performance with automatic freshness.
