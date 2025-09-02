## Create Form with Server Actions

Building a ticket creation form using Next.js Server Actions for seamless form handling without client-side JavaScript.

### The Implementation

#### Server Action (`src/features/ticket/actions/create-ticket.tsx`)

```typescript
"use server";

import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/paths";
import { revalidatePath } from "next/cache";

const createTicket = async (formData: FormData) => {
  const data = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    status: "OPEN",
  };

  await prisma.ticket.create({
    data: {
      title: data.title,
      content: data.content,
      status: "OPEN",
    },
  });

  revalidatePath(ticketsPath());
};

export { createTicket };
```

#### Form Component (`src/features/ticket/components/ticket-create-form.tsx`)

```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTicket } from "../actions/create-ticket";

const TicketCreateForm = () => {
  return (
    <form action={createTicket} className="flex flex-col gap-y-2">
      <Label htmlFor="title">Title</Label>
      <Input id="title" name="title" type="text" />

      <Label htmlFor="content">Content</Label>
      <Textarea id="content" name="content" />

      <Button type="submit">Create</Button>
    </form>
  );
};

export { TicketCreateForm };
```

### Common Errors and Solutions

#### Error 1: Server Action Not Marked Properly

**Runtime Error:**

```
Functions cannot be passed directly to Client Components unless you
explicitly expose it by marking it with "use server".
<form action={function createTicket} className=... children=...>
```

**Solution:**

- Add `"use server";` directive at the top of the server action file
- Make sure the function is `async`

#### Error 2: Non-Async Server Action

**Build Error:**

```
× Server Actions must be async functions.
./src/features/ticket/components/ticket-create-form.tsx
Error: × Server Actions must be async functions.
```

**Solution:**

```typescript
// ❌ Wrong - not async
const createTicket = (formData: FormData) => {
  "use server";
  // implementation
};

// ✅ Correct - async function
const createTicket = async (formData: FormData) => {
  "use server";
  // implementation
};
```

### How It Works

1. **Form Submission** - User fills form and clicks submit
2. **Server Action Execution** - `createTicket` runs on the server
3. **Data Extraction** - FormData API extracts form values
4. **Database Operation** - Prisma creates new ticket
5. **Cache Invalidation** - `revalidatePath` refreshes the tickets list
6. **Progressive Enhancement** - Works without JavaScript

### Key Features

#### **FormData API**

```typescript
const data = {
  title: formData.get("title") as string,
  content: formData.get("content") as string,
  status: "OPEN",
};
```

#### **Cache Invalidation**

```typescript
revalidatePath(ticketsPath()); // Refresh tickets list after creation
```

#### **Type Safety**

- FormData values are properly typed
- Prisma ensures database schema compliance

### Benefits

- **No Client JavaScript** - Form works without JS enabled
- **Progressive Enhancement** - Enhanced experience with JS
- **Server-Side Validation** - Validation happens on the server
- **Automatic Cache Updates** - List refreshes automatically
- **SEO Friendly** - Standard HTML form submission

### Missing Features (Future Improvements)

- **Form Reset** - Form doesn't clear after successful submission
- **Loading States** - No visual feedback during submission
- **Error Handling** - No validation or error display
- **Success Feedback** - No confirmation message

### Next Steps

The form currently handles basic creation but lacks user experience improvements like form reset, loading states, and error handling. These will be addressed in future form enhancements.
