## On-Demand Cache Invalidation

The most precise solution to our caching problem: invalidate the cache exactly when the data changes. Since the delete action is the root cause of the stale cache, we can revalidate the cache right there and solve the issue completely.

### The Perfect Solution

On-demand revalidation provides:

- **Immediate cache invalidation** when data changes
- **Best performance** - static caching until invalidation
- **Precise control** - only invalidate what actually changed
- **No waiting periods** - users see changes instantly

### Our Implementation

Updated `src/features/ticket/actions/delete-ticket.ts` with cache invalidation:

```typescript
"use server";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/paths";
import type { Route } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const deleteTicket = async (id: string) => {
  await prisma.ticket.delete({
    where: {
      id,
    },
  });

  revalidatePath(ticketsPath() as Route); // ← Key addition
  redirect(ticketsPath() as Route);
};
```

### How `revalidatePath` Works

1. **Database operation completes** - Ticket is deleted from database
2. **Cache invalidation** - `revalidatePath("/tickets")` clears the cached version
3. **Redirect happens** - User navigates to `/tickets`
4. **Fresh render** - Next.js renders the page with fresh data from database
5. **New cache** - Updated page is cached for future requests

### Benefits Over Previous Solutions

#### vs Force Dynamic (`export const dynamic = "force-dynamic"`)

- **Better performance** - Still uses static caching
- **Lower server load** - Only renders when data actually changes
- **Scalable** - Doesn't impact every page view

#### vs Time-Based ISR (`export const revalidate = 30`)

- **Immediate updates** - No 30-second delay
- **More efficient** - Only invalidates when necessary
- **Better UX** - Users see changes instantly

### On-Demand Revalidation Functions

#### `revalidatePath(path)`

```typescript
import { revalidatePath } from "next/cache";

// Invalidate specific path
revalidatePath("/tickets");
revalidatePath("/tickets/123");

// Invalidate all tickets paths
revalidatePath("/tickets", "layout"); // Invalidates layout and all nested pages
```

#### `revalidateTag(tag)`

```typescript
import { revalidateTag } from "next/cache";

// For tagged requests
export const getTickets = async () => {
  return await fetch("/api/tickets", {
    next: { tags: ["tickets"] },
  });
};

// Invalidate by tag
revalidateTag("tickets");
```

### When to Use Each Method

#### Use `revalidatePath` When:

- **Path-specific invalidation** - Only certain routes need updates
- **Simple cache structure** - Direct relationship between action and page
- **Immediate control** - Know exactly what to invalidate

#### Use `revalidateTag` When:

- **Complex dependencies** - Multiple pages share same data
- **API-based data** - Using fetch with cache tags
- **Granular control** - Different parts of app need different invalidation

### Complete Cache Strategy

For our tickets app, we can now remove ISR and rely on static + on-demand:

```typescript
// Remove this from page.tsx
// export const revalidate = 30;

export default async function TicketsPage() {
  // Page is now static by default
  // Only revalidates when revalidatePath is called
  const tickets = await getTickets();
  // Rest of component...
}
```

### Cache Flow After Implementation

```
User Action Flow:
1. User clicks delete → Server action executes
2. Database updated → Ticket deleted
3. Cache invalidated → revalidatePath("/tickets")
4. User redirected → redirect("/tickets")
5. Fresh page rendered → New data from database
6. New cache stored → For future requests
```

### Advanced Patterns

#### Multiple Path Invalidation

```typescript
export const deleteTicket = async (id: string) => {
  await prisma.ticket.delete({ where: { id } });

  // Invalidate multiple related paths
  revalidatePath("/tickets");
  revalidatePath("/");
  revalidatePath("/dashboard");

  redirect(ticketsPath() as Route);
};
```

#### Conditional Invalidation

```typescript
export const updateTicket = async (id: string, data: UpdateData) => {
  const updated = await prisma.ticket.update({
    where: { id },
    data,
  });

  // Only invalidate if status changed
  if (data.status) {
    revalidatePath("/tickets");
  }

  redirect(ticketPath(id) as Route);
};
```

### Error Handling

```typescript
export const deleteTicket = async (id: string) => {
  try {
    await prisma.ticket.delete({ where: { id } });
    revalidatePath(ticketsPath() as Route);
    redirect(ticketsPath() as Route);
  } catch (error) {
    // Don't invalidate cache if operation failed
    throw new Error("Failed to delete ticket");
  }
};
```

### Best Practices

1. **Invalidate after successful operations** - Only when data actually changes
2. **Invalidate before redirect** - Ensure fresh data when user navigates
3. **Be specific with paths** - Only invalidate what needs updating
4. **Handle errors properly** - Don't invalidate if operation fails
5. **Consider related paths** - Think about what else might be affected

### Production Considerations

- **Test thoroughly** - Cache behavior only visible in production builds
- **Monitor performance** - Ensure invalidation isn't too frequent
- **Consider batch operations** - Multiple changes might need multiple invalidations
- **Plan for scale** - Frequent invalidation can increase server load

### Current State: The Optimal Solution

Our tickets app now has the perfect caching strategy:

- **Static performance** - Fast cached responses by default
- **Immediate updates** - Cache invalidated exactly when data changes
- **Precise control** - Only invalidate what actually needs updating
- **Great UX** - Users see changes instantly without performance penalty

This on-demand approach gives us the best of all worlds: maximum performance with immediate data freshness.
