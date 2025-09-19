## ORM Generated Types

Prisma automatically generates TypeScript types from your database schema, providing full type safety throughout the application.

### Generated Types

When you run `npx prisma generate`, Prisma creates types based on your schema:

```typescript
// From our schema.prisma, Prisma generates:
type Ticket = {
  id: string;
  createAt: Date;
  updateAt: Date;
  title: string;
  content: string;
  status: TicketStatus;
};

enum TicketStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}
```

### Using Generated Types

#### In Components

Replaced manual type definitions with Prisma-generated types:

```typescript
import { Ticket } from "@prisma/client";

export type TicketItemProps = {
  ticket: Ticket; // Using Prisma-generated type
  isDetail?: boolean;
};
```

#### In Constants

Status constants automatically align with the generated enum:

```typescript
export const TICKET_ICONS = {
  OPEN: <LucideFileText />,
  IN_PROGRESS: <LucidePencil />,
  DONE: <LucideCircleCheck />,
};
```

### Benefits

- **Automatic sync** - Types update when schema changes
- **Type safety** - Catch type errors at compile time
- **IntelliSense** - Full autocomplete in your IDE
- **No manual maintenance** - Types are always up-to-date with database
- **Consistency** - Same types used across queries, components, and logic

### What's Replaced

- Removed manual type definitions from `src/features/ticket/types.ts`
- Components now use Prisma-generated `Ticket` type
- Status enums automatically match database schema
- Query return types are inferred from Prisma operations

### Auto-generation

Types are automatically regenerated when:

- Running `npm install` (via postinstall script)
- Running `npx prisma generate` manually
- After schema changes and migrations
