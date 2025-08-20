# Data Fetching in Client Components

This document outlines the implementation of data fetching in client components using React hooks (`useState` and `useEffect`) to manage asynchronous data loading.

## Overview

We implemented client-side data fetching for the tickets page to demonstrate how to handle asynchronous data loading, loading states, and component lifecycle in React client components. This approach is useful when data needs to be fetched after the initial page load or when implementing dynamic, interactive features.

## Implementation Structure

### File Organization

```
src/features/ticket/
├── queries/
│   └── get-tickets.ts          # Data fetching logic
├── types.ts                    # TypeScript type definitions
└── components/
    └── ticket-item.tsx         # Ticket display component

src/app/tickets/
└── page.tsx                    # Client component with data fetching
```

## Implementation Details

### 1. Data Fetching Query (`src/features/ticket/queries/get-tickets.ts`)

**What it does**: Provides an async function that simulates fetching tickets data with a network delay.

```typescript
import initialTickets from "@/tickets.data";
import { Ticket } from "../types";

export const getTickets = async (): Promise<Ticket[]> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return new Promise((resolve) => {
    resolve(initialTickets);
  });
};
```

**Key features**:

- **Simulated Network Delay**: 2-second timeout to mimic real API calls
- **Promise-based**: Returns a Promise for proper async/await handling
- **Type Safety**: Returns strongly typed `Ticket[]` array
- **Data Source**: Uses static data from `tickets.data.ts` (simulating API response)

**Why this approach**:

- Demonstrates realistic async behavior
- Allows testing of loading states
- Provides consistent interface for future API integration
- Maintains separation of concerns between data fetching and UI logic

### 2. Type Definitions (`src/features/ticket/types.ts`)

**What it defines**: TypeScript interfaces for type safety across the ticket feature.

```typescript
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "DONE";

export interface Ticket {
  id: number;
  title: string;
  content: string;
  status: TicketStatus;
}
```

**Benefits**:

- **Type Safety**: Prevents runtime errors with compile-time checking
- **IntelliSense**: Better developer experience with autocomplete
- **Documentation**: Self-documenting code through type definitions
- **Refactoring Safety**: Easy to find and update all usages

### 3. Client Component with Data Fetching (`src/app/tickets/page.tsx`)

**What it does**: Implements client-side data fetching using React hooks.

```typescript
"use client";
import { useEffect, useState } from "react";
import { getTickets } from "@/features/ticket/queries/get-tickets";

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
    // ... JSX rendering
  );
}
```

**Key implementation details**:

1. **"use client" directive**: Marks this as a client component that runs in the browser
2. **useState hook**: Manages the tickets state with initial empty array
3. **useEffect hook**: Handles side effects (data fetching) after component mount
4. **Async function wrapper**: Proper async/await handling within useEffect
5. **Empty dependency array**: Ensures effect runs only once on mount

**Why this pattern**:

- **Client-side rendering**: Allows for interactive features and dynamic updates
- **Lifecycle management**: useEffect ensures data fetching happens at the right time
- **State management**: useState provides reactive state updates
- **Error isolation**: Client-side errors don't crash the entire page

### 4. Data Source (`src/tickets.data.ts`)

**What it provides**: Static ticket data for development and testing.

```typescript
const initialTickets = [
  {
    id: 1,
    title: "Ticket 1",
    content: "This is the first ticket",
    status: "DONE" as const,
  },
  {
    id: 2,
    title: "Ticket 2",
    content: "This is the second ticket",
    status: "OPEN" as const,
  },
];
```

**Purpose**:

- **Development Data**: Provides consistent data during development
- **Type Enforcement**: Uses `as const` for strict type checking
- **Easy Testing**: Predictable data for testing scenarios
- **API Simulation**: Mimics the structure of real API responses

## Data Flow

1. **Component Mount**: TicketsPage component mounts and runs useEffect
2. **Data Fetching**: getTickets() is called, simulating a 2-second network request
3. **State Update**: Once data is received, setTickets updates the component state
4. **Re-render**: Component re-renders with the new ticket data
5. **UI Display**: Tickets are mapped and displayed using TicketItem components

## Benefits of This Approach

### 1. **Client-Side Interactivity**

- Enables dynamic updates without page refreshes
- Supports real-time features and user interactions
- Allows for optimistic updates and immediate feedback

### 2. **Separation of Concerns**

- Data fetching logic isolated in query functions
- UI components focus on presentation
- Type definitions centralized and reusable

### 3. **Developer Experience**

- Clear, predictable data flow
- Easy to test and debug
- TypeScript provides excellent autocomplete and error checking

### 4. **Scalability**

- Easy to extend with loading states, error handling
- Simple to integrate with state management libraries
- Straightforward migration to real APIs

## When to Use Client-Side Data Fetching

**Good for**:

- Interactive dashboards with real-time updates
- User-specific data that changes frequently
- Features requiring immediate user feedback
- Data that depends on user interactions

**Consider Server-Side Fetching for**:

- SEO-critical content
- Data that rarely changes
- Initial page load performance
- Public content that benefits from caching

## Future Enhancements

This implementation provides a foundation for:

- **Loading States**: Adding spinner or skeleton components
- **Error Handling**: Implementing try-catch blocks and error UI
- **Data Caching**: Integrating with React Query or SWR
- **Real APIs**: Replacing mock data with actual HTTP requests
- **Optimistic Updates**: Updating UI before server confirmation
