## DRY with Abstractions

Design forms and server actions so you write things once and reuse everywhere. DRY (Don’t Repeat Yourself) reduces bugs and keeps behavior consistent as your app grows.

### TL;DR

- **Abstraction** captures a stable idea (e.g., “upsert a ticket”) and hides details
- **Unify create + edit** into one flow using optional props and a single server action
- **Centralize side-effects** (cache invalidation, redirects) in one place
- **Prefer small, focused abstractions** over many near-duplicates

### Where duplication creeps in

- **Components**: separate CreateForm and EditForm with 90% shared code
- **Server actions**: separate createTicket and updateTicket that differ by one line
- **Side-effects**: copy-pasted revalidate/redirect logic in multiple places

The cure is a thin, well-named abstraction with a clear contract.

### Our abstraction in practice: a single Upsert flow

We use one component and one server action for both create and edit flows.

#### 1) One server action: upsertTicket

```typescript
"use server";

import { prisma } from "@/lib/prisma";
import { ticketPath, ticketsPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const upsertTicket = async (id: string | undefined, formData: FormData) => {
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

  if (!id) {
    return; // create: stay on the list page
  }
  redirect(ticketPath(id)); // edit: go back to detail
};

export { upsertTicket };
```

Why this is DRY:

- One place to change validation, shape, or side-effects
- One mental model: “given optional id, create or update accordingly”
- No duplicate create/update actions that drift over time

Enhancement ideas:

- Also revalidate the detail page after update: `revalidatePath(ticketPath(id))`
- Add validation (e.g., Zod) before upsert
- Return typed result or error state for richer UI feedback

#### 2) One component: TicketUpsertForm

```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import { Ticket } from "@prisma/client";

export type TicketUpsertFormProps = {
  ticket?: Ticket;
};

const TicketUpsertForm = ({ ticket }: TicketUpsertFormProps) => {
  return (
    <form
      action={upsertTicket.bind(null, ticket?.id)}
      className="flex flex-col gap-y-2"
    >
      <Label htmlFor="title">Title</Label>
      <Input id="title" name="title" type="text" defaultValue={ticket?.title} />

      <Label htmlFor="content">Content</Label>
      <Textarea id="content" name="content" defaultValue={ticket?.content} />

      <Button type="submit">{ticket ? "Edit" : "Create"}</Button>
    </form>
  );
};

export { TicketUpsertForm };
```

Why this is DRY:

- One form component supports both modes via an optional `ticket`
- Label, inputs, layout, and accessibility live in one place
- Button text derives from the same source of truth (`ticket` prop)

### How it’s used in the app

#### Create on the list page

```typescript
// src/app/tickets/page.tsx
<CardComp
  title="Tickets"
  description="All your tickets at one place."
  content={<TicketUpsertForm />}
  className="w-full max-w-[420px] self-center"
/>
```

#### Edit on the detail/edit page

```typescript
// src/app/tickets/[ticketId]/edit/page.tsx
<CardComp
  title="Edit Ticket"
  description="Edit your ticket"
  className="w-full max-w-[420px] animate-fade-in-from-top"
  content={<TicketUpsertForm ticket={ticket} />}
/>
```

Same component, different props. No duplication.

### Abstraction contract

- **Input**: `id | undefined` and `FormData`
- **Behavior**: creates when `id` is undefined, updates when `id` exists
- **Side-effects**: revalidates list page; redirects to detail after update
- **Return**: void (can evolve to return success/error for richer UX)

### Guardrails to keep abstractions healthy

- Keep the abstraction small; don’t make it handle unrelated concerns
- Centralize cross-cutting side-effects (revalidation, redirects) here
- Validate inputs at the boundary (action) and keep components slim
- Prefer explicit names (`upsertTicket`, `TicketUpsertForm`) over generic

### Common pitfalls (and fixes)

- “Prop explosion” in the form: extract a smaller composite if options balloon
- Divergent side-effects between create/update: unify logic or branch once
- Validation scattered across components: move it to the action boundary

### Checklist

- **Find duplication**: near-identical forms/actions? extract an abstraction
- **Define the contract**: input, behavior, side-effects, and return shape
- **Make it composable**: small component with clear props
- **Add tests**: minimal unit tests for create vs. update branches
- **Evolve**: when requirements change, refine the abstraction instead of forking it

### Next steps (optional polish)

- Add schema validation (Zod) inside `upsertTicket`
- Show pending state with `useFormStatus` and disable submit while processing
- Return a result (success/error) to drive toasts or inline errors
- Revalidate the detail page after update for guaranteed freshness

This upsert pattern keeps the codebase DRY, cohesive, and easy to extend as your ticket feature grows.
