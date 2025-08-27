## Where Do We Cache? - Complete Next.js Caching Strategy

Next.js provides multiple caching layers, each serving different purposes and use cases. Here's the complete hierarchy:

```
                           Next.js Caching
                                 |
                    ┌────────────┴────────────┐
                    │                         │
              Client-Side Cache          Server-Side Cache
                "Soft" Cache               "Hard" Cache
                    │                         │
         ┌──────────┴──────────┐             │
         │                     │             │
    Router Cache         [Other Client       │
         |               Caches]             │
    ┌────┴────┐                              │
    │         │                              │
next.config  <Link                    Full Route Cache
             prefetch>                       │
    |         |                    ┌────────┴────────┐
    |         |                    │                 │
application  prefetch         Static Rendering  Dynamic Rendering
level cache   cache                 │              │
                               ┌────┴────┐    - always most
                               │         │      recent data
                          keep static   ISR
                             │           │
                           - blog   ┌────┴────┐
                                    │         │
                               time-based  on-demand
                                caching    caching
                                  │          │
                                - news    - web apps
                              - ecommerce
```

### Client-Side Cache ("Soft" Cache)

#### Router Cache

**What it caches**: Navigation routes and Server Component payloads
**Control mechanisms**:

1. **Application Level Cache (`next.config`)**

   - Global stale times configuration
   - Controls how long dynamic routes stay cached

   ```typescript
   const nextConfig = {
     experimental: {
       staleTimes: {
         dynamic: 30, // Cache for 30 seconds
       },
     },
   };
   ```

2. **Prefetch Cache (`<Link prefetch>`)**
   - Individual route prefetching
   - Loads routes before user navigation
   ```typescript
   <Link prefetch href="/tickets/123">
     View Ticket
   </Link>
   ```

### Server-Side Cache ("Hard" Cache)

#### Full Route Cache

**What it caches**: Complete rendered route outputs
**Rendering strategies**:

##### 1. Static Rendering

**When to use**: Content that rarely changes

**Sub-strategies**:

- **Keep Static**

  - **Use case**: Blogs, documentation
  - **Behavior**: Cached until next deployment
  - ```typescript
    // Default behavior - stays static
    export default function BlogPost() { ... }
    ```

- **ISR (Incremental Static Regeneration)**

  - **Use cases**: News sites, ecommerce catalogs
  - **Behavior**: Static with automatic updates

  **Time-Based Caching**:

  ```typescript
  export const revalidate = 60; // Revalidate every 60 seconds
  ```

  **On-Demand Caching**:

  ```typescript
  import { revalidatePath } from "next/cache";
  revalidatePath("/products"); // Invalidate immediately
  ```

##### 2. Dynamic Rendering

- **Use case**: Web apps with frequently changing data
- **Behavior**: Always renders with most recent data
- ```typescript
  export const dynamic = "force-dynamic";
  ```

### Caching Strategy Decision Tree

#### Choose **Keep Static** When:

- Content changes rarely (blogs, documentation)
- SEO is critical
- Maximum performance needed

#### Choose **Time-Based ISR** When:

- Content changes regularly but not constantly
- Can tolerate some staleness (news, product catalogs)
- Want balance of performance and freshness

#### Choose **On-Demand ISR** When:

- Need immediate updates after data changes
- Content changes unpredictably
- Want static performance with real-time accuracy (web apps)

#### Choose **Dynamic Rendering** When:

- User-specific content required
- Real-time data essential
- Content changes very frequently

### Our Tickets App Journey

We explored all these strategies:

1. **Started with**: Static (accidental) - caused stale data
2. **Tried**: Dynamic rendering - solved freshness but slow
3. **Improved to**: Time-based ISR - balanced performance and freshness
4. **Optimized with**: On-demand ISR - perfect solution

**Final implementation**:

```typescript
// Static by default (fast)
export default async function TicketsPage() {
  const tickets = await getTickets();
  // ...
}

// On-demand invalidation (immediate updates)
export const deleteTicket = async (id: string) => {
  await prisma.ticket.delete({ where: { id } });
  revalidatePath("/tickets"); // ← Perfect solution
  redirect("/tickets");
};
```

### Cache Performance Characteristics

| Strategy           | Speed   | Freshness                | Server Load | Best For  |
| ------------------ | ------- | ------------------------ | ----------- | --------- |
| **Keep Static**    | Fastest | Stale until rebuild      | Lowest      | Blogs     |
| **Time-based ISR** | Fast    | Within interval          | Low         | News      |
| **On-demand ISR**  | Fast    | Immediate when triggered | Medium      | Web apps  |
| **Dynamic**        | Slower  | Always fresh             | Highest     | Real-time |

### Best Practices

1. **Start with Static** - Default to fastest option
2. **Add ISR when needed** - For changing content
3. **Use on-demand for mutations** - Immediate consistency
4. **Reserve dynamic for special cases** - User-specific or real-time data
5. **Test in production** - Caching behavior only visible in production builds

### The Perfect Strategy

For most web applications like our tickets app:

- **Static rendering** for maximum performance
- **On-demand revalidation** for immediate consistency
- **Strategic invalidation** only when data actually changes

This gives you the best of all worlds: blazing fast static performance with real-time data accuracy exactly when you need it.
