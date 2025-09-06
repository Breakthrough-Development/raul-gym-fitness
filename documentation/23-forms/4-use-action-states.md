## useActionState with Server Actions

`useActionState` connects a form to a Server Action and gives you a typed state object back from the server on every submit. It’s great for rendering success messages, field-level errors, and keeping server logic as the source of truth.

### TL;DR

- Pattern: `const [state, formAction] = useActionState(serverAction, initialState)` then `<form action={formAction}>`.
- The Server Action receives the current state as the 2nd argument and returns a new state.
- Use it for inline errors, success banners, and non-redirect flows; you can still redirect when needed.

### Our current implementation (success message)

```tsx
// src/features/ticket/components/ticket-upsert-form.tsx (excerpt)
"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import { Ticket } from "@prisma/client";
import { useActionState } from "react";
import { SubmitButton } from "@/components/form/submit-button";

export type TicketUpsertFormProps = { ticket?: Ticket };

const TicketUpsertForm = ({ ticket }: TicketUpsertFormProps) => {
  const [actionState, formAction] = useActionState(
    upsertTicket.bind(null, ticket?.id),
    { message: "" }
  );

  return (
    <form action={formAction} className="flex flex-col gap-y-2">
      <Label htmlFor="title">Title</Label>
      <Input id="title" name="title" type="text" defaultValue={ticket?.title} />

      <Label htmlFor="content">Content</Label>
      <Textarea id="content" name="content" defaultValue={ticket?.content} />

      <SubmitButton label={ticket ? "Edit" : "Create"} />

      {actionState.message}
    </form>
  );
};
```

```ts
// src/features/ticket/actions/upsert-ticket.tsx (excerpt)
"use server";
import { prisma } from "@/lib/prisma";
import { ticketPath, ticketsPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const upsertTicket = async (
  id: string | undefined,
  _actionState: { message: string },
  formData: FormData
) => {
  const data = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  };

  await prisma.ticket.upsert({
    where: { id: id || "" },
    update: data,
    create: data,
  });

  revalidatePath(ticketsPath());

  if (id) {
    redirect(ticketPath(id));
  }

  return { message: "Ticket created" };
};

export { upsertTicket };
```

Notes:

- When editing, we redirect back to the detail page.
- When creating, we return a message that the form renders inline.

### Field-level validation pattern

Return a structured state with errors; render them next to inputs. Works with and without JS (full reload shows the same output).

```ts
// actions/upsert-ticket.tsx (validation sketch)
type TicketState = {
  message?: string;
  errors?: { title?: string; content?: string };
};

export async function upsertTicket(
  id: string | undefined,
  _state: TicketState,
  formData: FormData
): Promise<TicketState> {
  const title = (formData.get("title") || "").toString().trim();
  const content = (formData.get("content") || "").toString().trim();
  const errors: TicketState["errors"] = {};

  if (!title) errors.title = "Title is required";
  if (content.length < 10)
    errors.content = "Content must be at least 10 characters";
  if (errors.title || errors.content) return { errors };

  // perform upsert…
  return { message: id ? "Ticket updated" : "Ticket created" };
}
```

```tsx
// components/ticket-upsert-form.tsx (rendering sketch)
const [state, formAction] = useActionState(
  upsertTicket.bind(null, ticket?.id),
  {}
);

<form action={formAction}>
  <Label htmlFor="title">Title</Label>
  <Input
    id="title"
    name="title"
    defaultValue={ticket?.title}
    aria-invalid={!!state.errors?.title}
  />
  {state.errors?.title && (
    <p role="alert" className="text-sm text-destructive">
      {state.errors.title}
    </p>
  )}

  <Label htmlFor="content">Content</Label>
  <Textarea
    id="content"
    name="content"
    defaultValue={ticket?.content}
    aria-invalid={!!state.errors?.content}
  />
  {state.errors?.content && (
    <p role="alert" className="text-sm text-destructive">
      {state.errors.content}
    </p>
  )}

  <SubmitButton label={ticket ? "Edit" : "Create"} />

  {state.message && (
    <p className="text-sm text-muted-foreground">{state.message}</p>
  )}
</form>;
```

### When to use `useActionState` vs redirects

- **Render-in-place** flows (stay on the same page): use `useActionState` and return state.
- **Navigate-after-submit** flows: call `redirect()` in the action (no state is returned).
- You can mix the two like we do: redirect on edit, render message on create.

### Best practices

- Keep validation on the server so the form works without JS.
- Return a minimal, serializable state (strings, numbers, objects/arrays).
- Co-locate the shape of state near the action so UI and logic stay in sync.
- Pair with `useFormStatus` to disable submit and show pending UI.

### Common pitfalls

- Returning non-serializable values from actions (Dates/Maps/Classes) will break state.
- Mutating the previous state object; always return a new one.
- Using `useActionState` far from the form; keep it in the component that renders the form so the mental model remains clear.

`useActionState` lets you build progressively enhanced forms with clear, server-defined state—perfect for inline messages and validation while keeping the server as the source of truth.
react hook that allows for form state error message
