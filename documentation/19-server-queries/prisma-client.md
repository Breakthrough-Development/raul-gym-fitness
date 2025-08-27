## Prisma Client Setup

The Prisma client is the generated type-safe database client that we use to query the database from our Next.js application.

### Client Instance

Created `src/lib/prisma.ts` to manage the Prisma client instance:

```typescript
import { PrismaClient } from "@prisma/client";

// Prevent hot reloading from creating new instance of Prisma Client
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### Why This Pattern?

- **Singleton pattern** - Ensures only one Prisma client instance exists
- **Development optimization** - Prevents creating multiple connections during hot reloads
- **Production ready** - In production, creates a fresh instance as expected
- **Global reuse** - The same client instance is shared across the app

### Usage

Import the client in any file where you need database access:

```typescript
import { prisma } from "@/lib/prisma";

// Use in Server Components, API routes, or server actions
const tickets = await prisma.ticket.findMany();
```

### What's Next

- Create database query functions using this client
- Replace mock data with real database queries
- Implement CRUD operations for tickets
