## What is Caching?

A cache is a temporary storage area that stores frequently accessed data for quick retrieval. When data is requested:

- **Cache hit**: Data is found in cache → returned immediately (fast)
- **Cache miss**: Data not in cache → retrieved from original source and stored for future use

### Key Benefits

- **Faster response times** - No need to fetch from slow data sources
- **Reduced server load** - Fewer requests to databases/APIs
- **Better user experience** - Pages load quicker
- **Lower costs** - Less bandwidth and server resources used

### Common Caching Examples

#### Hardware Level

- **[RAM](https://bit.ly/3wNE2db) vs Hard Drive**: RAM stores frequently accessed data for quick retrieval, while the hard drive stores less frequently accessed data
- **CPU Cache**: Stores recently used instructions for faster processing

#### Software Level

- **Database Cache ([Redis](https://bit.ly/3R6zLs2))**: Stores frequently accessed data (e.g., user sessions) for quick retrieval, compared to slower databases like PostgreSQL
- **Browser Cache**: Stores web pages, images, CSS, and JavaScript files locally
- **CDN Cache**: Geographic distribution of static assets

### Web Development Caching

In web applications, caching happens at multiple levels:

1. **Browser Cache** - Stores static assets locally
2. **Server Cache** - Caches database queries and computed results
3. **CDN Cache** - Geographic distribution of content
4. **Application Cache** - In-memory storage of frequently used data

### Caching in Next.js

Next.js applies caching extensively across different areas:

- **Static Site Generation (SSG)** - Pre-built pages cached at build time
- **Server-Side Rendering (SSR)** - Can cache rendered pages
- **API Routes** - Response caching for API endpoints
- **Data Fetching** - Automatic caching of fetch requests
- **Image Optimization** - Cached optimized images
- **Route Segment Cache** - Caches route components

### Cache Strategies

#### Time-based (TTL - Time To Live)

```javascript
// Cache for 1 hour
fetch("/api/data", { next: { revalidate: 3600 } });
```

#### Tag-based Invalidation

```javascript
// Invalidate when specific data changes
revalidateTag("tickets");
```

#### Manual Invalidation

```javascript
// Clear cache programmatically
revalidatePath("/tickets");
```

### Trade-offs

**Pros:**

- Significantly improved performance
- Reduced server load and costs
- Better scalability

**Cons:**

- **Stale data** - Cache might serve outdated information
- **Cache invalidation complexity** - Hard to keep cache fresh
- **Memory usage** - Caches consume storage space
- **Debugging difficulty** - Cached responses can hide issues

### Cache Invalidation Challenge

> "There are only two hard things in Computer Science: cache invalidation and naming things." - Phil Karlton

The challenge is knowing **when** to update or clear the cache to ensure users get fresh data while maintaining performance benefits.

### In Our Tickets App

We're experiencing a classic caching issue:

- Deleting a ticket doesn't immediately reflect in the tickets list
- The cached version of `/tickets` doesn't know about the deletion
- Need proper cache invalidation strategies

In the following lessons, we'll explore how caching works specifically in Next.js and how to solve these challenges.
