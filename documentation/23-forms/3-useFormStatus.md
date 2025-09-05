## useFormStatus for Server Action Forms

`useFormStatus` provides form-scoped pending state for submissions made via `<form action={serverAction}>` or `useActionState`. It enables accessible loading UI, prevents double submissions, and keeps your inputs responsive.

### TL;DR

- Works only inside a Client Component that is a descendant of the submitting `<form>`.
- Use it to disable the submit button and show a loading indicator while the action runs.
- Pair it with `useActionState` if you want to render server-returned messages/errors.

### Our implementation

We use a small reusable submit button that reads the form’s status.

```tsx
// src/components/form/submit-button.tsx
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { LucideLoaderCircle } from "lucide-react";

export type SubmitButtonProps = {
  label: string;
};

const SubmitButton = ({ label }: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <LucideLoaderCircle className="h-4 w-4 animate-spin" />}
      {label}
    </Button>
  );
};

export { SubmitButton };
```

- The hook exposes `{ pending }` for the current form submission.
- Disabling the button prevents duplicate submits while the server action is running.

### Used in our upsert form

We combine `useActionState` (to receive messages from the server) with `useFormStatus` (to show pending state):

```tsx
// src/features/ticket/components/ticket-upsert-form.tsx (excerpt)
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import { Ticket } from "@prisma/client";
import { useActionState } from "react";
import { SubmitButton } from "@/components/form/submit-button";

export type TicketUpsertFormProps = {
  ticket?: Ticket;
};

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

export { TicketUpsertForm };
```

### Server action shape (with `useActionState`)

The action accepts the state as the second parameter and returns a new state object. While the submission is in flight, `useFormStatus().pending` is true.

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

### When to use `useFormStatus` vs `useTransition`

- Use `useFormStatus` inside a form that uses `action={...}` or `useActionState`.
- Use `useTransition` for imperative triggers (e.g., onClick outside a form), or when coordinating optimistic UI and non-form updates.

### Best practices

- Disable the submit while `pending` to prevent duplicate requests.
- Consider adding `aria-busy` or visually indicating progress for a11y.
- Keep validation and side-effects in the server action so the form works without JS.
- If you need field-level errors, return them via `useActionState` and render near inputs.

### Common pitfalls

- The hook must be used within the same form subtree; placing it outside the form returns `pending: false`.
- It does not run in Server Components; your button must be a Client Component.
- If you bypass the form’s `action` (e.g., preventDefault and manual fetch), `useFormStatus` won’t reflect that submission.

`useFormStatus` gives you a precise, form-scoped pending state that integrates perfectly with Server Actions—use it for submit buttons and simple loading UI, while keeping your forms resilient by default.
