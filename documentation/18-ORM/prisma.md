## Prisma ORM Setup

Prisma is a type-safe ORM that generates TypeScript types from your database schema.
Website: [https://www.prisma.io/](https://www.prisma.io/)

### Installation

Install Prisma as a dev dependency:

```bash
npm install prisma --save-dev
```

### Package.json Script

Added a postinstall script to automatically generate the Prisma client:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

This ensures the Prisma client is generated whenever dependencies are installed.

### What's Next

- Initialize Prisma in the project
- Configure the database schema
- Set up the first migration
- Create database queries
