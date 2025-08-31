## Request Memoization

We can cache a function that runs multiple times with the `cache` function that comes from React. It would run if it gets different input and it would use the cached one if the inputs are the same.

### What is Request Memoization?

Request memoization is a technique that caches function results during a single request. If the same function is called multiple times with the same arguments during one request, it returns the cached result instead of executing again.

### React's cache() Function

React provides the `cache()` function for request-level memoization:

```typescript
import { cache } from "react";

const getTicket = cache(async function getTicket(id: string) {
  console.log(id); // This will only log once per unique ID per request
  return await prisma.ticket.findUnique({
    where: { id },
  });
});
```

### How It Works

1. **First call**: `getTicket("123")` → Executes database query → Caches result
2. **Second call**: `getTicket("123")` → Returns cached result (no database query)
3. **Different input**: `getTicket("456")` → Executes new database query → Caches new result

### Our Implementation

#### With Memoization (`get-ticket.ts`)

```typescript
import { prisma } from "@/lib/prisma";
import { cache } from "react";

const getTicket = cache(async function getTicket(id: string) {
  console.log(id);
  return await prisma.ticket.findUnique({
    where: {
      id,
    },
  });
});

export { getTicket };
```

#### Without Memoization (`get-tickets.ts`)

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

### When Request Memoization Helps

#### Scenario: Component Tree with Duplicate Queries

```typescript
// Parent component
async function TicketPage({ params }) {
  const ticket = await getTicket(params.id); // First call

  return (
    <div>
      <TicketHeader ticket={ticket} />
      <TicketBody ticketId={params.id} /> {/* Might call getTicket again */}
      <TicketSidebar ticketId={params.id} /> {/* Might call getTicket again */}
    </div>
  );
}

// Child component
async function TicketBody({ ticketId }) {
  const ticket = await getTicket(ticketId); // Uses cached result!
  return <div>{ticket.content}</div>;
}
```

### Benefits

- **Reduces database calls** - Same query not executed multiple times
- **Improves performance** - Faster response times
- **Request-scoped** - Cache is automatically cleared after request
- **Simple to implement** - Just wrap function with `cache()`

### Cache Scope and Limitations

#### Request-Level Only

- **Cache persists**: Only during a single request
- **Cache clears**: Automatically when request ends
- **No cross-request caching**: Each new request starts fresh

#### Input-Based Caching

```typescript
// These are different cache entries
getTicket("123"); // Cache entry 1
getTicket("456"); // Cache entry 2
getTicket("123"); // Uses cache entry 1
```

### When to Use Request Memoization

#### Use When:

- **Multiple components** might fetch the same data during one request
- **Complex component trees** with potential duplicate queries
- **Expensive computations** that might be repeated
- **Third-party API calls** that are expensive

#### Don't Use When:

- **Simple, single queries** - No duplicate calls expected
- **Mutations** - Cache might return stale data
- **Cross-request persistence needed** - Use other caching strategies

### Debugging with Console Logs

The `console.log(id)` in our implementation helps debug caching:

```typescript
const getTicket = cache(async function getTicket(id: string) {
  console.log(id); // Only logs once per unique ID per request
  return await prisma.ticket.findUnique({ where: { id } });
});
```

**Expected behavior**:

- First call to `getTicket("123")` → Logs "123"
- Second call to `getTicket("123")` → No log (uses cache)
- Call to `getTicket("456")` → Logs "456"

### Best Practices

1. **Wrap pure functions** - Functions that return same output for same input
2. **Use descriptive names** - Make cached functions easy to identify
3. **Add logging** - Debug cache hits/misses during development
4. **Document cache usage** - Make it clear which functions are memoized
5. **Test cache behavior** - Verify functions are actually being cached

### Performance Impact

#### Without Memoization

```
Request: /tickets/123
├── TicketPage calls getTicket("123") → DB Query 1
├── TicketHeader calls getTicket("123") → DB Query 2
└── TicketSidebar calls getTicket("123") → DB Query 3
Total: 3 database queries
```

#### With Memoization

```
Request: /tickets/123
├── TicketPage calls getTicket("123") → DB Query 1 (cached)
├── TicketHeader calls getTicket("123") → Cache hit
└── TicketSidebar calls getTicket("123") → Cache hit
Total: 1 database query
```

### Combining with Other Caching Strategies

Request memoization works alongside other caching:

1. **Request memoization** - Eliminates duplicate calls within one request
2. **Route caching** - Caches entire page responses
3. **Database connection pooling** - Reuses database connections
4. **CDN caching** - Caches static assets

### Current State

Our implementation uses request memoization for:

- ✅ `getTicket` - Cached to prevent duplicate queries for same ticket
- ❌ `getTickets` - Not cached (typically called once per request)

This optimizes our app by reducing unnecessary database calls when the same ticket is fetched multiple times during a single request.
