## Typed APIs: Prisma Types vs Custom Types

When building applications with Prisma, you have different strategies for typing your components and APIs.

### Small to Medium Projects

For smaller projects, using Prisma-generated types directly works well:

```typescript
import { Ticket } from "@prisma/client";

// Direct use of Prisma types
export type TicketItemProps = {
  ticket: Ticket;
  isDetail?: boolean;
};
```

**Benefits:**

- Simple and straightforward
- Always in sync with database schema
- Less code to maintain
- Automatic type updates

### Advanced Typing: Function Return Types

A more sophisticated approach uses the actual return types of your database functions:

```typescript
import { getTicket } from "@/features/ticket/queries/get-ticket";
import { getTickets } from "@/features/ticket/queries/get-tickets";

export type TicketItemProps = {
  ticket:
    | Awaited<ReturnType<typeof getTicket>>
    | Awaited<ReturnType<typeof getTickets>>[number];
  isDetail?: boolean;
};
```

This approach:

- **Automatically adapts** to query changes
- **Handles nullable types** (`getTicket` can return `null`)
- **Supports multiple sources** (single ticket or item from list)
- **TypeScript infers** exact return types from Prisma operations

### Large Projects: Custom Component Types

For larger projects, you might want to create custom types for components:

```typescript
// Custom component types based on database queries
type TicketDisplayProps = {
  id: string;
  title: string;
  status: "OPEN" | "IN_PROGRESS" | "DONE";
  // Only include fields the component actually needs
};

// Derived from database function calls
type TicketListItem = Pick<Ticket, "id" | "title" | "status" | "createAt">;
```

**Benefits:**

- Components only receive data they need
- Better separation of concerns
- Easier to refactor database without breaking UI
- More explicit about component dependencies

**Drawbacks:**

- More error-prone - manual type definitions can get out of sync
- Additional maintenance overhead
- Need to manually update when database changes
- Risk of type drift between database and components

### Current Approach

For this project, we're using Prisma-generated types directly since:

- Project size is manageable
- Team is small
- Rapid development is preferred
- Database schema is relatively stable

### When to Switch

Consider custom component types when:

- Project has 50+ components using database types
- Multiple teams working on different parts
- UI and database evolve at different speeds
- Components need subset of database fields
- API responses need transformation

### Best Practices

1. **Start simple** - Use Prisma types initially
2. **Extract selectively** - Create custom types only when needed
3. **Document relationships** - Make clear how custom types relate to database
4. **Automate when possible** - Use utility types to derive from Prisma types
