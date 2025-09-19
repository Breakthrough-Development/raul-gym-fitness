## Development vs Production Caching

Next.js behaves differently in development and production modes, especially regarding caching strategies.

### Development Mode (`npm run dev`)

- **No aggressive caching** - Pages and data refresh on every request
- **Hot reloading** - Changes reflect immediately
- **Dynamic by default** - All routes are rendered on demand
- **Instant feedback** - Good for development but not performance-optimized

### Production Mode (`npm run build && npm run start`)

Next.js enables aggressive caching and optimization:

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

### Caching Issues in Our App

**Problem**: When we delete a ticket on `/tickets/[ticketId]`, the change doesn't reflect on `/tickets` until we rebuild and restart.

**Why this happens**:

- `/tickets` page is cached as static content (○)
- The cached version doesn't know about the deletion
- Data becomes stale until cache is invalidated

### Testing Production Caching

**Cannot run dev and production simultaneously** - Need to build and test separately.

**Process for testing**:

1. `npm run build` - Build the production version
2. `npm run start` - Start production server locally
3. Test caching behavior
4. Make changes and repeat (slow and tedious)

### Route Types

- **○ (Static)** - Prerendered as static content, aggressively cached
- **ƒ (Dynamic)** - Server-rendered on demand, can be cached but more flexible

### Our Requirements

We want tickets to render **dynamically** because:

- Tickets are frequently created/updated/deleted
- Users expect to see fresh data immediately
- Static caching causes stale data issues

### Solutions

1. **Force dynamic rendering** with `export const dynamic = 'force-dynamic'`
2. **Use revalidation** to refresh cached data
3. **Implement cache invalidation** after mutations
4. **Use opt-out caching strategies** for frequently changing data

### Best Practices

- **Test production builds** regularly to catch caching issues
- **Understand route types** and their caching implications
- **Use dynamic rendering** for frequently changing data
- **Implement proper cache invalidation** strategies
