## Database Seeding

Seeding means putting initial or mock data into the database. This is useful for development and testing.

### Setup

1. **Install tsx** - TypeScript execution engine:

   ```bash
   npm i tsx
   ```

2. **Add script to package.json**:
   ```json
   {
     "scripts": {
       "prisma-seed": "tsx prisma/seed.ts"
     }
   }
   ```

### Seed File

Created `prisma/seed.ts` with initial ticket data:

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tickets = [
  {
    title: "Ticket 1",
    content: "This is the first ticket",
    status: "DONE" as const,
  },
  {
    title: "Ticket 2",
    content: "This is the second ticket",
    status: "OPEN" as const,
  },
  {
    title: "Ticket 3",
    content: "This is the third ticket",
    status: "OPEN" as const,
  },
];

const seed = async () => {
  await prisma.ticket.deleteMany(); // Clear existing data
  await prisma.ticket.createMany({
    data: tickets,
  });
};
```

### Running the Seed

Execute the seed script:

```bash
npm run prisma-seed
```

This will:

- Clear all existing tickets
- Insert the initial ticket data
- Show timing information in the console

### What's Next

- Replace mock data queries with actual Prisma client calls
- Create database query functions for the app
