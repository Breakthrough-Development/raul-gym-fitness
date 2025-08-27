## Server Actions in Server Components

Server Actions can be used directly in server components, particularly within forms, providing a powerful way to handle form submissions without JavaScript while maintaining progressive enhancement.

### Server Action Definition

Using the same `deleteTicket` server action:

```typescript
"use server";
import { prisma } from "@/lib/prisma";

export const deleteTicket = async (id: string) => {
  await prisma.ticket.delete({
    where: {
      id,
    },
  });
};
```

### Using in Forms (Server Components)

In `src/features/ticket/components/ticket-item.tsx`, the delete button uses a form with server action:

```typescript
import { deleteTicket } from "../actions/delete-ticket";

const TicketItem = ({ ticket, isDetail }: TicketItemProps) => {
  const deleteButton = (
    <form action={deleteTicket.bind(null, ticket.id)}>
      <Button variant="outline" size="icon">
        <LucideTrash className="h-4 w-4" />
        <span className="sr-only">Delete ticket {ticket.id}</span>
      </Button>
    </form>
  );

  // Rest of component...
};
```

### How It Works

1. **Form action** - The `action` attribute points to the server action
2. **Parameter binding** - `deleteTicket.bind(null, ticket.id)` pre-binds the ticket ID
3. **Progressive enhancement** - Works without JavaScript
4. **Automatic submission** - Form submits when button is clicked
5. **Server execution** - Action runs on the server after form submission

### Key Differences from Client Components

| Aspect                     | Server Components                | Client Components                   |
| -------------------------- | -------------------------------- | ----------------------------------- |
| **Form handling**          | Built-in with `action` attribute | Manual with `onClick` or `onSubmit` |
| **JavaScript requirement** | None (works without JS)          | Required for interactivity          |
| **User experience**        | Page refresh/navigation          | Seamless in-page updates            |
| **Accessibility**          | Native form behavior             | Requires additional handling        |

### Benefits of Server Component Approach

- **Progressive enhancement** - Works even if JavaScript fails to load
- **Better accessibility** - Native form submission behavior
- **SEO friendly** - Search engines can understand form structure
- **Simpler code** - No need for event handlers or state management
- **Zero client JavaScript** - Smaller bundle size

### When to Use Each Approach

#### Use Server Components (Forms) When:

- Building accessible, progressive forms
- JavaScript bundle size is a concern
- Simple CRUD operations
- SEO is important for the form

#### Use Client Components When:

- Need real-time feedback
- Complex validation or state management
- Optimistic updates required
- Rich interactive experiences

### Advanced Form Patterns

#### With Form Data

```typescript
"use server";
export async function createTicket(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  await prisma.ticket.create({
    data: { title, content, status: "OPEN" },
  });
}

// In component
<form action={createTicket}>
  <input name="title" required />
  <textarea name="content" required />
  <button type="submit">Create Ticket</button>
</form>;
```

#### With Validation

```typescript
"use server";
export async function updateTicket(id: string, formData: FormData) {
  const title = formData.get("title") as string;

  if (!title || title.length < 3) {
    throw new Error("Title must be at least 3 characters");
  }

  await prisma.ticket.update({
    where: { id },
    data: { title },
  });
}
```

### Best Practices

- **Parameter binding** - Use `.bind()` to pass additional parameters to server actions
- **Validation** - Always validate form data in server actions
- **Error handling** - Use error boundaries to catch server action errors
- **Loading states** - Consider using `useFormStatus` for pending states
- **Accessibility** - Ensure forms work with keyboard navigation and screen readers

### What's Next

- Implement form validation and error handling
- Add loading states with `useFormStatus`
- Create reusable form components with server actions
- Handle redirects after successful form submissions
