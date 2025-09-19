## Router Cache

The Router Cache is a client-side cache in Next.js that stores the rendered Server Component payloads. It caches navigation routes to provide instant navigation between pages.

### Global Stale Time Configuration

You can make dynamic pages act like static content for a specific duration using `staleTimes`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
    staleTimes: {
      dynamic: 30, // Cache dynamic routes for 30 seconds
    },
  },
};

export default nextConfig;
```

### How It Works

- **Dynamic routes** are cached for 30 seconds after first visit
- During this time, navigation to cached routes is instant
- After 30 seconds, the cache expires and fresh data is fetched

### Benefits

- **Instant navigation** - No loading time between cached pages
- **Reduced server load** - Fewer requests during cache period
- **Better user experience** - Smooth transitions between pages

### Trade-offs

⚠️ **Caution**: Users might see content that has been deleted or modified during the cache period.

**Example scenario**:

1. User visits `/tickets/123` (cached for 30 seconds)
2. Ticket gets deleted by another user
3. Original user navigating back still sees the deleted ticket
4. Only after 30 seconds will they see the updated state

### Fine-Grained Control: Prefetching

For more precise control, use Link prefetching to cache specific routes:

```typescript
const detailButton = (
  <Button asChild variant="outline" size="icon">
    <Link prefetch href={ticketPath(ticket.id) as Route}>
      <LucideSquareArrowOutUpRight className="h-4 w-4" />
      <span className="sr-only">View ticket {ticket.id}</span>
    </Link>
  </Button>
);
```

### Prefetch Behavior

- **On viewport render** - When the Link enters the viewport, it prefetches the route
- **Background fetching** - HTTPS request happens automatically in the background
- **Instant navigation** - When clicked, page loads immediately (no loading spinner)
- **Network tab** - You can see the prefetch requests in browser DevTools

### Prefetch Options

```typescript
// Default prefetch (on viewport)
<Link href="/tickets/123">View Ticket</Link>

// Explicit prefetch control
<Link prefetch={true} href="/tickets/123">View Ticket</Link>  // Always prefetch
<Link prefetch={false} href="/tickets/123">View Ticket</Link> // Never prefetch
<Link prefetch={null} href="/tickets/123">View Ticket</Link>  // Prefetch on hover
```

### When to Use Each Strategy

#### Global Stale Times

**Use when**:

- Content doesn't change frequently
- User experience is more important than data freshness
- You have predictable navigation patterns

#### Link Prefetching

**Use when**:

- You want selective caching
- Some routes are more important than others
- You need fine-grained control over what gets cached

### Current Configuration

Our app currently uses:

```typescript
const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
    // No staleTimes configured - using Next.js defaults
  },
};
```

### Debugging Router Cache

1. **Network Tab** - See prefetch requests happening automatically
2. **Navigation Speed** - Instant navigation indicates cache hit
3. **React DevTools** - Inspect component re-renders during navigation

### Best Practices

- **Consider data freshness requirements** before enabling stale times
- **Use prefetch strategically** on important navigation paths
- **Monitor user behavior** to optimize cache settings
- **Test with real network conditions** to see the impact
- **Balance performance vs data accuracy** based on your app's needs

### Router Cache vs Other Caches

| Cache Type           | Scope                     | Duration                 | Control            |
| -------------------- | ------------------------- | ------------------------ | ------------------ |
| **Router Cache**     | Client-side navigation    | Configurable stale times | Global or per-link |
| **Data Cache**       | Server-side data fetching | Until revalidated        | Per-request        |
| **Full Route Cache** | Server-side rendering     | Until redeployment       | Per-route          |
