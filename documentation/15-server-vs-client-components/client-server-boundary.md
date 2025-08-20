# Next.js Client-Server Boundary

This document explains the boundary between server and client components in Next.js, how they work together, and the rules that govern component execution environments.

## Overview

Next.js 13+ introduced the App Router with a fundamental distinction between Server Components (default) and Client Components (marked with `"use client"`). Understanding this boundary is crucial for building performant, SEO-friendly applications while maintaining interactivity where needed.

## Component Types

### Server Components (Default)

Components that run on the server during build time or request time.

**Characteristics**:

- Execute on the server
- Have access to server-side resources (databases, file system)
- Cannot use browser APIs or React hooks
- Excellent for SEO and initial page load performance
- Zero JavaScript bundle impact on the client

**Example from our codebase**:

```typescript
// src/app/tickets/[ticketId]/page.tsx - Server Component
export default function TicketPage({ params }: TicketPageProps) {
  const ticketId = Number(params.ticketId);
  const ticket = initialTickets.find((ticket) => ticket.id === ticketId);

  if (!ticket) {
    return <Placeholder label="Ticket not found" />;
  }

  return (
    <div className="flex justify-center animate-fade-from-top">
      <TicketItem ticket={ticket} isDetail />
    </div>
  );
}
```

### Client Components

Components that run in the browser after hydration.

**Characteristics**:

- Execute in the browser
- Can use React hooks (`useState`, `useEffect`, etc.)
- Have access to browser APIs (DOM, localStorage, etc.)
- Enable interactivity and dynamic behavior
- Contribute to JavaScript bundle size

**Example from our codebase**:

```typescript
// src/app/tickets/page.tsx - Client Component
"use client";
import { useEffect, useState } from "react";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const tickets = await getTickets();
      setTickets(tickets);
    };
    fetchTickets();
  }, []);

  return (
    // JSX with dynamic state
  );
}
```

## When Components Become Client Components

### 1. Direct "use client" Directive

When a component is explicitly marked with `"use client"` at the top of the file:

```typescript
"use client";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme(); // React hook usage
  // ...
}
```

### 2. Parent Component Inheritance

When a parent component is a Client Component, all its children automatically become Client Components:

```typescript
// Parent (Client Component)
"use client";
export function ParentComponent() {
  return (
    <div>
      <ChildComponent /> {/* Automatically becomes Client Component */}
    </div>
  );
}

// Child (Inherits Client Component status)
export function ChildComponent() {
  // This is now a Client Component, even without "use client"
  // Can use hooks and browser APIs
}
```

### 3. Ancestor Component Inheritance

If any ancestor in the component tree is a Client Component, all descendants become Client Components:

```
Server Component (Layout)
├── Server Component (Header)
│   ├── Client Component (ThemeSwitcher) ← "use client"
│   │   └── Any child becomes Client Component
│   └── Server Component (Navigation) ← Remains server
└── Server Component (Main Content)
```

## Boundary Rules in Our Application

### Example 1: Mixed Boundaries in Layout

```typescript
// src/app/layout.tsx - Server Component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {" "}
          {/* Client Component */}
          <Header /> {/* Server Component */}
          <main>{children}</main> {/* Can be either */}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Example 2: Header with Mixed Components

```typescript
// src/components/header.tsx - Server Component
const Header = () => {
  return (
    <header>
      <nav>
        <Link href="/">Home</Link> {/* Server Component */}
        <ThemeSwitcher /> {/* Client Component */}
        <Link href="/tickets">Tickets</Link> {/* Server Component */}
      </nav>
    </header>
  );
};
```

### Example 3: Page-Level Boundaries

```typescript
// Server Component Page
export default function TicketPage({ params }) {
  // Server-side data processing
  const ticket = findTicket(params.ticketId);

  return (
    <div>
      <Heading title={ticket.title} />     {/* Server Component */}
      <TicketItem ticket={ticket} />       {/* Server Component */}
    </div>
  );
}

// vs Client Component Page
"use client";
export default function TicketsPage() {
  // Client-side state and effects
  const [tickets, setTickets] = useState([]);

  return (
    <div>
      <Heading title="Tickets" />          {/* Now Client Component */}
      {tickets.map(ticket =>
        <TicketItem ticket={ticket} />     {/* Now Client Component */}
      )}
    </div>
  );
}
```

## Key Boundary Concepts

### 1. The Boundary is One-Way

- Server Components can import and render Client Components
- Client Components **cannot** import Server Components
- Client Components can pass Server Components as children (composition pattern)

### 2. Props Serialization

Data passed from Server to Client Components must be serializable:

```typescript
// ✅ Valid - Serializable data
<ClientComponent
  title="Hello"
  count={42}
  data={{ id: 1, name: "Test" }}
/>

// ❌ Invalid - Functions cannot be serialized
<ClientComponent
  onClick={() => console.log("click")} // Error!
/>
```

### 3. Context Boundaries

React Context providers must be Client Components:

```typescript
// src/components/theme/theme-provider.tsx
"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system">
      {children} {/* Children can be Server or Client Components */}
    </NextThemesProvider>
  );
}
```

## Performance Implications

### Server Components Benefits

1. **Zero JavaScript**: No impact on client bundle size
2. **SEO**: Full content available on initial HTML
3. **Performance**: Faster initial page loads
4. **Security**: Sensitive logic stays on server

### Client Components Trade-offs

1. **Bundle Size**: JavaScript sent to browser
2. **Hydration**: Additional processing on client
3. **Interactivity**: Required for dynamic behavior
4. **User Experience**: Enables rich interactions

## Best Practices from Our Implementation

### 1. Default to Server Components

Start with Server Components and only add `"use client"` when needed:

```typescript
// Good: Server Component for static content
export default function TicketPage({ params }) {
  const ticket = getTicket(params.ticketId);
  return <TicketItem ticket={ticket} isDetail />;
}
```

### 2. Minimize Client Component Scope

Keep Client Components as small and focused as possible:

```typescript
// Good: Only ThemeSwitcher needs client-side code
const Header = () => (
  <header>
    <Logo /> {/* Server Component */}
    <Navigation /> {/* Server Component */}
    <ThemeSwitcher /> {/* Client Component - minimal scope */}
  </header>
);
```

### 3. Use Composition for Mixed Content

Pass Server Components as children to Client Components:

```typescript
// Client Component wrapper
"use client";
export function InteractiveWrapper({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && children} {/* Server Component can be passed as children */}
    </div>
  );
}

// Usage
<InteractiveWrapper>
  <ServerRenderedContent /> {/* Stays as Server Component */}
</InteractiveWrapper>;
```

### 4. Strategic Data Fetching

- Use Server Components for initial data loading
- Use Client Components for dynamic, user-triggered data

```typescript
// Server Component - Initial data
export default function TicketPage({ params }) {
  const ticket = await getTicketFromDB(params.ticketId); // Server-side
  return <TicketDisplay ticket={ticket} />;
}

// Client Component - Dynamic data
("use client");
export function TicketComments({ ticketId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Client-side data fetching for dynamic content
    fetchComments(ticketId).then(setComments);
  }, [ticketId]);

  return <CommentsList comments={comments} />;
}
```

## Common Pitfalls

### 1. Unnecessary Client Components

```typescript
// ❌ Bad: Making entire page client-side for one interactive element
"use client";
export default function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Header /> {/* Now unnecessarily client-side */}
      <StaticContent /> {/* Now unnecessarily client-side */}
      <Counter count={count} setCount={setCount} />{" "}
      {/* Only this needs client-side */}
    </div>
  );
}

// ✅ Good: Isolate client-side needs
export default function HomePage() {
  return (
    <div>
      <Header /> {/* Server Component */}
      <StaticContent /> {/* Server Component */}
      <ClientCounter /> {/* Client Component - isolated */}
    </div>
  );
}
```

### 2. Context Misuse

```typescript
// ❌ Bad: Server Component trying to use context
export default function ServerPage() {
  const theme = useTheme(); // Error! Server Components can't use hooks
  return <div className={theme}>Content</div>;
}

// ✅ Good: Client Component using context
("use client");
export default function ClientPage() {
  const theme = useTheme(); // Works! Client Component can use hooks
  return <div className={theme}>Content</div>;
}
```

## Summary

The client-server boundary in Next.js is determined by:

1. **Explicit declaration**: `"use client"` directive
2. **Inheritance**: Children of Client Components become Client Components
3. **Component architecture**: Strategic placement for optimal performance

Understanding this boundary allows you to build applications that are both performant (through Server Components) and interactive (through selective use of Client Components), as demonstrated in our ticket management application.
