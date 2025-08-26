## Prisma Studio

Prisma Studio is a visual database browser that lets you view and edit your database data in a user-friendly interface.

### Opening Prisma Studio

Run the following command to open Prisma Studio:

```bash
npx prisma studio
```

This will:

- Start a local web server (usually on http://localhost:5555)
- Open your database in a visual interface
- Allow you to browse, edit, and manage your data

### Benefits

Instead of using the Supabase web dashboard, Prisma Studio offers:

- **Local access** - Runs on your machine, closer to your development environment
- **Better integration** - Works directly with your Prisma schema
- **Type safety** - Respects your Prisma model definitions and constraints
- **Easier development** - Quick access without switching to external websites

### What You Can Do

- View all tables and their data
- Create, edit, and delete records
- Filter and search data
- See relationships between tables
- Validate data against your schema

### When to Use

- During development to check seeded data
- To manually test database operations
- To verify migrations worked correctly
- For quick data debugging and inspection
