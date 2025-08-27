## Redirect in Server Actions

Using Next.js `redirect()` function in server actions to navigate users after successful operations.

### Redirect Implementation

Updated `src/features/ticket/actions/delete-ticket.ts` to redirect after deletion:

```typescript
"use server";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/paths";
import type { Route } from "next";
import { redirect } from "next/navigation";

export const deleteTicket = async (id: string) => {
  await prisma.ticket.delete({
    where: {
      id,
    },
  });

  redirect(ticketsPath() as Route);
};
```

### Path Constants

Using centralized path constants from `src/paths.ts`:

```typescript
export const ticketsPath = () => "/tickets";
export const ticketPath = (ticketId: string) => `/tickets/${ticketId}`;
export const homePath = () => "/";
```

### How It Works

1. **Server action executes** - Database operation completes
2. **Redirect is called** - `redirect()` function is invoked
3. **Navigation occurs** - User is redirected to the tickets list page
4. **Fresh data** - New page load shows updated data without the deleted ticket

### Benefits

- **Immediate feedback** - User sees the result of their action
- **Fresh data** - No stale data or cache issues
- **Clean URLs** - Proper navigation flow
- **Server-side redirect** - Works without JavaScript

### Type Safety

Using Next.js typed routes:

```typescript
import type { Route } from "next";

// Type-safe redirect
redirect(ticketsPath() as Route);
```

This ensures:

- **Compile-time checking** of route validity
- **Autocomplete** for available routes
- **Refactoring safety** when routes change

### Use Cases

#### After Delete Operations

```typescript
export const deleteTicket = async (id: string) => {
  await prisma.ticket.delete({ where: { id } });
  redirect(ticketsPath() as Route);
};
```

#### After Create Operations

```typescript
export const createTicket = async (formData: FormData) => {
  const ticket = await prisma.ticket.create({
    data: {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      status: "OPEN",
    },
  });
  redirect(ticketPath(ticket.id) as Route);
};
```

#### After Update Operations

```typescript
export const updateTicket = async (id: string, formData: FormData) => {
  await prisma.ticket.update({
    where: { id },
    data: { title: formData.get("title") as string },
  });
  redirect(ticketPath(id) as Route);
};
```

### Best Practices

- **Always redirect after mutations** - Prevents duplicate submissions
- **Use path constants** - Centralize route definitions
- **Type your routes** - Use Next.js Route type for safety
- **Redirect to logical destinations** - Where users expect to go next
- **Handle errors** - Don't redirect if operations fail

### Error Handling

```typescript
export const deleteTicket = async (id: string) => {
  try {
    await prisma.ticket.delete({ where: { id } });
    redirect(ticketsPath() as Route);
  } catch (error) {
    // Handle error without redirect
    throw new Error("Failed to delete ticket");
  }
};
```

### What's Next

- Add error handling to prevent redirects on failures
- Implement conditional redirects based on operation results
- Add loading states during redirect transitions
