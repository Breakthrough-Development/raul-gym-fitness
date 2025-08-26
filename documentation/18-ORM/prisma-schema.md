## Prisma Schema Configuration

The `prisma/schema.prisma` file defines our database structure and generates TypeScript types.

### Database Connection

Set up the connection to Supabase using environment variables:

```prisma
datasource db {
    provider  = "postgresql"
    url       = env("DATABASE_URL")
    directUrl = env("DIRECT_URL")
}
```

### Ticket Model

Created the main Ticket model based on our existing data structure:

```prisma
model Ticket {
    id       String       @id @default(cuid())
    createAt DateTime     @default(now())
    updateAt DateTime     @updatedAt
    title    String
    content  String       @db.VarChar(1024)
    status   TicketStatus @default(OPEN)
}
```

### TicketStatus Enum

Created an enum for ticket statuses:

```prisma
enum TicketStatus {
    OPEN
    IN_PROGRESS
    DONE
}
```

### Sync with Database

Use Prisma DB Push to sync the schema with Supabase:

```bash
npx prisma db push
```

This command:

- Creates tables in the Supabase database
- Updates the database schema to match our Prisma schema
- Generates the Prisma client with TypeScript types

### What's Next

- Replace the mock data with actual database queries
- Set up Prisma client in the app
- Create database query functions
