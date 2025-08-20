# Data Fetching in Server Components

This document explains how to implement data fetching in Next.js Server Components, covering patterns, benefits, and best practices for server-side data loading.

## Overview

Server Components in Next.js run on the server during build time or request time, making them ideal for data fetching. Unlike Client Components, they can directly access databases, file systems, and other server-side resources without exposing sensitive credentials to the client.

## Key Benefits of Server-Side Data Fetching

### 1. **Performance**

- Data is fetched on the server, reducing client-side JavaScript
- Faster initial page loads with pre-rendered content
- No loading states needed for initial data

### 2. **Security**

- Database credentials and API keys stay on the server
- No exposure of sensitive logic to the client
- Direct access to internal systems

### 3. **SEO**

- Content is available in the initial HTML
- Search engines can index the complete page
- Better Core Web Vitals scores

### 4. **Developer Experience**

- Simpler code without loading states for initial data
- Direct async/await syntax
- No need for client-side data fetching libraries

## Implementation Patterns

### Pattern 1: Direct Data Access in Page Components

Server Components can directly fetch data using async/await:

```typescript
// src/app/tickets/[ticketId]/page.tsx - Real example from our codebase
import initialTickets from "@/tickets.data";

export type TicketPageProps = {
  params: {
    ticketId: string;
  };
};

export default function TicketPage({ params }: TicketPageProps) {
  // Direct data access - no loading state needed
  const ticketId = Number(params.ticketId);
  const ticket = initialTickets.find((ticket) => ticket.id === ticketId);

  if (!ticket) {
    return (
      <Placeholder
        label="Ticket not found"
        button={
          <Button asChild variant="outline">
            <Link href={ticketsPath()}>Back to tickets</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex justify-center animate-fade-from-top">
      <TicketItem ticket={ticket} isDetail />
    </div>
  );
}
```

**Key characteristics**:

- **Synchronous rendering**: No loading states needed
- **Direct data access**: Access to server-side data sources
- **Error handling**: Can return different JSX based on data availability
- **Type safety**: Full TypeScript support for data shapes

### Pattern 2: Async Server Component Data Fetching

For real database or API calls, use async Server Components:

```typescript
// Example: Async Server Component
export default async function TicketsPage() {
  // This runs on the server during request time
  const tickets = await fetchTicketsFromDatabase();
  const user = await getCurrentUser();

  return (
    <div>
      <Heading
        title={`${user.name}'s Tickets`}
        description={`You have ${tickets.length} tickets`}
      />

      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <TicketItem key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
}

// Helper function for data fetching
async function fetchTicketsFromDatabase() {
  // Direct database access - only possible on server
  const db = await connectToDatabase();
  const tickets = await db.collection("tickets").find({}).toArray();

  // Data processing on the server
  return tickets.map((ticket) => ({
    ...ticket,
    formattedDate: new Date(ticket.createdAt).toLocaleDateString(),
  }));
}
```

### Pattern 3: Parallel Data Fetching

Fetch multiple data sources in parallel for better performance:

```typescript
export default async function DashboardPage() {
  // Parallel data fetching
  const [tickets, user, stats] = await Promise.all([
    fetchTickets(),
    fetchUserProfile(),
    fetchDashboardStats(),
  ]);

  return (
    <div className="dashboard">
      <UserProfile user={user} />
      <StatsOverview stats={stats} />
      <TicketList tickets={tickets} />
    </div>
  );
}
```

### Pattern 4: Data Fetching with URL Parameters

Access route parameters and search params for data fetching:

```typescript
export default async function SearchPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: { q?: string; page?: string };
}) {
  const { category } = params;
  const query = searchParams.q || "";
  const page = Number(searchParams.page) || 1;

  // Server-side data fetching with parameters
  const results = await searchTickets({
    category,
    query,
    page,
    limit: 10,
  });

  return (
    <SearchResults
      results={results}
      category={category}
      query={query}
      currentPage={page}
    />
  );
}
```

## Real Examples from Our Codebase

### Example 1: Static Data Access

Our ticket detail page demonstrates simple server-side data access:

```typescript
// src/app/tickets/[ticketId]/page.tsx
export default function TicketPage({ params }: TicketPageProps) {
  const ticketId = Number(params.ticketId);
  const ticket = initialTickets.find((ticket) => ticket.id === ticketId);

  // Server-side conditional rendering
  if (!ticket) {
    return <Placeholder label="Ticket not found" />;
  }

  return <TicketItem ticket={ticket} isDetail />;
}
```

**Benefits demonstrated**:

- **No loading state**: Data is available immediately
- **Server-side validation**: Check data existence before rendering
- **SEO-friendly**: Content is in the initial HTML

### Example 2: Tickets List Page (Current Implementation)

Our current tickets page uses async Server Component data fetching:

```typescript
// src/app/tickets/page.tsx - Current implementation
import Heading from "@/components/heading";
import TicketItem from "@/features/ticket/components/ticket-item";
import { getTickets } from "@/features/ticket/queries/get-tickets";

export default async function TicketsPage() {
  const tickets = await getTickets(); // Server-side async data fetching

  return (
    <section className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Tickets Page"
        description="All your tickets at one place."
      />

      <div>
        <ul className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
          {tickets.map((ticket) => (
            <TicketItem key={ticket.id} ticket={ticket} />
          ))}
        </ul>
      </div>
    </section>
  );
}
```

**Benefits demonstrated**:

- **Async Server Component**: Uses `async` function for data fetching
- **Direct data access**: No client-side loading states needed
- **Type safety**: Full TypeScript support with typed data
- **Performance**: The 2-second delay in `getTickets()` happens on server

**Our `getTickets()` implementation:**

```typescript
// src/features/ticket/queries/get-tickets.ts
import initialTickets from "@/tickets.data";
import { Ticket } from "../types";

export const getTickets = async (): Promise<Ticket[]> => {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API delay
  return new Promise((resolve) => {
    resolve(initialTickets);
  });
};
```

This function simulates a real API call with a 2-second delay. In Server Components, this delay happens on the server, so users receive fully rendered content without seeing loading spinners.

## Advanced Patterns

### Pattern 5: Data Fetching with Error Boundaries

Handle errors gracefully in Server Components:

```typescript
export default async function TicketsPage() {
  try {
    const tickets = await fetchTickets();
    return <TicketList tickets={tickets} />;
  } catch (error) {
    console.error("Failed to fetch tickets:", error);

    // Return error UI
    return (
      <ErrorBoundary>
        <p>Failed to load tickets. Please try again later.</p>
        <RetryButton />
      </ErrorBoundary>
    );
  }
}
```

### Pattern 6: Conditional Data Fetching

Fetch different data based on conditions:

```typescript
export default async function UserDashboard({
  params,
}: {
  params: { userId: string };
}) {
  const user = await getUser(params.userId);

  // Conditional data fetching based on user role
  const data = await (user.role === "admin"
    ? fetchAdminDashboardData(user.id)
    : fetchUserDashboardData(user.id));

  return <Dashboard user={user} data={data} isAdmin={user.role === "admin"} />;
}
```

### Pattern 7: Data Fetching with Caching

Leverage Next.js caching for better performance:

```typescript
// Cached data fetching function
async function getTickets() {
  // Next.js automatically caches this fetch
  const response = await fetch("https://api.example.com/tickets", {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tickets");
  }

  return response.json();
}

export default async function TicketsPage() {
  const tickets = await getTickets(); // Cached result

  return <TicketList tickets={tickets} />;
}
```

## Data Fetching Best Practices

### 1. **Use TypeScript for Data Shapes**

Define clear interfaces for your data:

```typescript
// src/features/ticket/types.ts
export interface Ticket {
  id: number;
  title: string;
  content: string;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Use in Server Components
export default async function TicketsPage(): Promise<JSX.Element> {
  const tickets: Ticket[] = await fetchTickets();
  return <TicketList tickets={tickets} />;
}
```

### 2. **Handle Loading and Error States**

Even though Server Components don't need loading states, handle errors gracefully:

```typescript
export default async function DataPage() {
  try {
    const data = await fetchData();

    if (!data || data.length === 0) {
      return <EmptyState message="No data available" />;
    }

    return <DataDisplay data={data} />;
  } catch (error) {
    return <ErrorState error={error} />;
  }
}
```

### 3. **Optimize with Parallel Fetching**

When fetching multiple independent data sources:

```typescript
// ✅ Good: Parallel fetching
export default async function Dashboard() {
  const [user, tickets, notifications] = await Promise.all([
    fetchUser(),
    fetchTickets(),
    fetchNotifications(),
  ]);

  return <DashboardContent {...{ user, tickets, notifications }} />;
}

// ❌ Bad: Sequential fetching
export default async function Dashboard() {
  const user = await fetchUser(); // Wait for user
  const tickets = await fetchTickets(); // Then wait for tickets
  const notifications = await fetchNotifications(); // Then wait for notifications

  return <DashboardContent {...{ user, tickets, notifications }} />;
}
```

### 4. **Keep Data Fetching Close to Usage**

Fetch data in the component that needs it:

```typescript
// ✅ Good: Data fetching in the component that uses it
export default async function TicketPage({
  params,
}: {
  params: { id: string };
}) {
  const ticket = await fetchTicket(params.id);
  return <TicketDetail ticket={ticket} />;
}

// ❌ Bad: Fetching all data at the top level
export default async function Layout() {
  const allTickets = await fetchAllTickets(); // Unnecessary for most pages
  return <LayoutWithTickets tickets={allTickets} />;
}
```

### 5. **Use Proper Error Handling**

Implement comprehensive error handling:

```typescript
async function fetchTickets(): Promise<Ticket[]> {
  try {
    const response = await fetch("/api/tickets");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Validate data shape
    if (!Array.isArray(data)) {
      throw new Error("Invalid data format received");
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    throw error; // Re-throw to be handled by component
  }
}
```

## Performance Considerations

### 1. **Caching Strategies**

Use Next.js built-in caching for better performance:

```typescript
// Static data - cached at build time
export default async function StaticPage() {
  const data = await fetch("https://api.example.com/static-data", {
    cache: "force-cache", // Cache indefinitely
  });
  return <StaticContent data={data} />;
}

// Dynamic data - cache with revalidation
export default async function DynamicPage() {
  const data = await fetch("https://api.example.com/dynamic-data", {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });
  return <DynamicContent data={data} />;
}

// Real-time data - no caching
export default async function RealTimePage() {
  const data = await fetch("https://api.example.com/realtime-data", {
    cache: "no-store", // Always fetch fresh
  });
  return <RealTimeContent data={data} />;
}
```

### 2. **Streaming and Suspense**

For better perceived performance, use streaming:

```typescript
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <div>
      <Header />

      <Suspense fallback={<TicketsSkeleton />}>
        <TicketsSection />
      </Suspense>

      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection />
      </Suspense>
    </div>
  );
}

// This component will stream in when data is ready
async function TicketsSection() {
  const tickets = await fetchTickets(); // This can be slow
  return <TicketList tickets={tickets} />;
}
```

## When to Use Server vs Client Data Fetching

### Use Server Components for:

- **Initial page data**: Data needed for the first render
- **SEO-critical content**: Content that needs to be indexed
- **Sensitive operations**: Database queries, API calls with secrets
- **Static or slowly-changing data**: Content that doesn't change often

### Use Client Components for:

- **User interactions**: Data that changes based on user actions
- **Real-time updates**: Live data that updates frequently
- **Personalized content**: Data that depends on client-side state
- **Progressive enhancement**: Additional data loaded after initial render

## Real-World Migration Example: Our Tickets Page

This is an actual migration we performed in our codebase, moving from client-side data fetching to server-side data access.

### Before (Client Component with Hooks):

```typescript
// src/app/tickets/page.tsx - Original version
"use client";
import Heading from "@/components/heading";
import TicketItem from "@/features/ticket/components/ticket-item";
import { Ticket } from "@/features/ticket/types";
import { useEffect, useState } from "react";
import { getTickets } from "@/features/ticket/queries/get-tickets";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const tickets = await getTickets(); // Had artificial 2-second delay
      setTickets(tickets);
    };
    fetchTickets();
  }, []);

  return (
    <section className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Tickets Page"
        description="All your tickets at one place."
      />

      <div>
        <ul className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
          {tickets.map((ticket) => (
            <TicketItem key={ticket.id} ticket={ticket} />
          ))}
        </ul>
      </div>
    </section>
  );
}
```

**Issues with the original approach**:

- Required `"use client"` directive
- Needed React hooks (`useState`, `useEffect`)
- Had loading states and potential race conditions
- Artificial 2-second delay from `getTickets()` function
- Client-side JavaScript bundle impact

### After (Server Component with Async Data Fetching):

```typescript
// src/app/tickets/page.tsx - Current version
import Heading from "@/components/heading";
import TicketItem from "@/features/ticket/components/ticket-item";
import { getTickets } from "@/features/ticket/queries/get-tickets";

export default async function TicketsPage() {
  // Async data fetching - no hooks needed!
  const tickets = await getTickets();

  return (
    <section className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Tickets Page"
        description="All your tickets at one place."
      />

      <div>
        <ul className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
          {tickets.map((ticket) => (
            <TicketItem key={ticket.id} ticket={ticket} />
          ))}
        </ul>
      </div>
    </section>
  );
}
```

**Improvements achieved**:

- ✅ **Eliminated client-side JavaScript**: No more `"use client"` needed
- ✅ **Removed React hooks**: No `useState`, `useEffect`, or loading states
- ✅ **Instant content rendering**: No artificial delays or loading spinners
- ✅ **Better SEO**: Content available in initial HTML
- ✅ **Simpler code**: Direct data access without complex state management

### Migration Steps Taken:

1. **Removed `"use client"` directive**: Component now runs on server
2. **Eliminated React hooks**: No more `useState` and `useEffect`
3. **Added async to function**: Made component async to support server-side data fetching
4. **Changed to async data fetching**: Using `await getTickets()` instead of hooks
5. **Simplified component logic**: Removed loading states and async effects

### When This Migration Makes Sense:

This migration was beneficial because:

- **Initial render data**: Data is needed immediately when page loads
- **Performance improvement**: 2-second delay now happens on server, not client
- **No user interaction needed**: No real-time updates or user-triggered changes needed
- **SEO important**: Ticket listings should be indexed by search engines
- **Simpler data flow**: Direct async/await instead of hook-based state management

### Alternative Approach for Dynamic Data:

If we needed dynamic data fetching, we could use an async Server Component:

```typescript
// Alternative: Async Server Component for dynamic data
export default async function TicketsPage() {
  // This would run on each request
  const tickets = await fetchTicketsFromDatabase();

  return (
    <section className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Tickets Page"
        description={`You have ${tickets.length} tickets.`}
      />

      <div>
        <ul className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
          {tickets.map((ticket) => (
            <TicketItem key={ticket.id} ticket={ticket} />
          ))}
        </ul>
      </div>
    </section>
  );
}

async function fetchTicketsFromDatabase() {
  // Real database query
  const response = await fetch("http://localhost:3000/api/tickets");
  if (!response.ok) {
    throw new Error("Failed to fetch tickets");
  }
  return response.json();
}
```

**Benefits of migration**:

- **Simpler code**: No useState, useEffect, or loading states
- **Better performance**: No client-side JavaScript for data fetching
- **SEO benefits**: Content available in initial HTML
- **Improved UX**: No loading spinners for initial data

## Summary

Server Components provide powerful data fetching capabilities that offer:

1. **Better performance** through server-side rendering
2. **Enhanced security** by keeping sensitive operations on the server
3. **Improved SEO** with content available in initial HTML
4. **Simpler code** without client-side loading states

Use Server Components for initial data loading and Client Components for interactive, user-driven data updates. This combination provides the best of both worlds: fast initial loads and dynamic interactivity where needed.

Our codebase demonstrates these patterns with the ticket detail page showing server-side data access and error handling, providing a foundation for more complex data fetching scenarios.
