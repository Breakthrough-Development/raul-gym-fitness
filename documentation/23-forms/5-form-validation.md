## Form Validation (Server-first with Zod)

Validate on the server to keep forms reliable without JavaScript, then progressively enhance the UX in the client. We use a Zod schema inside the Server Action so the server remains the source of truth.

### TL;DR

- Put validation in the Server Action so it works with or without JS.
- Use Zod to parse and validate `FormData`.
- Return a serializable state via `useActionState` for inline messages.
- Optionally expand to field-level errors when needed.

### Our current implementation

```ts
// src/features/ticket/actions/upsert-ticket.tsx (excerpt)
"use server";
import { prisma } from "@/lib/prisma";
import { ticketPath, ticketsPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

const upsertTicketSchema = z.object({
  title: z.string().min(1).max(191),
  content: z.string().min(1).max(1024),
});

const upsertTicket = async (
  id: string | undefined,
  _actionState: { message: string },
  formData: FormData
) => {
  try {
    const data = upsertTicketSchema.parse({
      title: formData.get("title") as string,
      content: formData.get("content") as string,
    });

    await prisma.ticket.upsert({
      where: { id: id || "" },
      update: data,
      create: data,
    });
  } catch (error) {
    return { message: "Something went wrong" };
  }

  revalidatePath(ticketsPath());

  if (!id) {
    return { message: "Ticket created" };
  }
  redirect(ticketPath(id));
  return { message: "Ticket updated" };
};

export { upsertTicket };
```

```tsx
// src/features/ticket/components/ticket-upsert-form.tsx (excerpt)
"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import { Ticket } from "@prisma/client";
import { SubmitButton } from "@/components/form/submit-button";
import { useActionState } from "react";

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

### Why server-first validation?

- Works without JS (full page submit still validates and returns a result).
- Single source of truth (no client/server divergence).
- Simpler security posture (don’t trust client input).

### Extending to field-level errors (optional)

If you want per-field errors, return a structured state and render near inputs:

```ts
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

### Best practices

- Keep schemas near actions; validate all untrusted input on the server.
- Return only serializable state (strings/numbers/objects/arrays).
- Pair with `useFormStatus` to disable submit while pending.
- Consider mirroring critical validation in the client for instant feedback (optional), but never remove server validation.

### Summary

Server-first validation with Zod + `useActionState` gives you robust forms that work everywhere and scale to richer UX with minimal code changes.
