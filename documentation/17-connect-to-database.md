## Connect to Database

We will be using Supabase with Prisma for our database setup.

### Supabase Setup

1. **Create a Supabase account** at [https://supabase.com/](https://supabase.com/)
2. **Create a new project**:
   - Choose a project name
   - Set a secure database password (save this!)
   - Select a region close to your users
3. **Get your connection strings**:
   - Go to Settings → Database
   - Copy the connection strings from the "Connection string" section

### Environment Variables

Create a `.env.local` file in your project root with your Supabase connection strings:

```env
# Connect to Supabase via connection pooling (for app queries)
DATABASE_URL="postgresql://postgres.hjyzthqdumvnqbcjzzfy:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database (for migrations)
DIRECT_URL="postgresql://postgres.hjyzthqdumvnqbcjzzfy:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
```

**Important**: Replace `[YOUR-PASSWORD]` with your actual database password from Supabase.

### What's Next

- Install and configure Prisma
- Set up database schema
- Create migrations
- Implement database queries in the app
