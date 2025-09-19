## Resetting Forms after Server Actions

A few practical ways to clear inputs and reset state after a successful submit—without breaking progressive enhancement.

### TL;DR

- Prefer server-first logic. Use the Server Action result to decide when to reset.
- Three common approaches:
  1. Call `form.reset()` in a client wrapper when the action reports success.
  2. Re-mount the form by changing its `key` on success.
  3. Navigate (redirect) after submit—which inherently resets the form.

### Our baseline

We already return a success message from the action on create (and redirect on edit):

```ts
// src/features/ticket/actions/upsert-ticket.tsx (excerpt)
// ... after validation + upsert
revalidatePath(ticketsPath());

if (!id) {
  return { message: "Ticket created" }; // stays on the same page
}
redirect(ticketPath(id)); // edit flow navigates away (implicit reset)
```

And the form renders that message:

```tsx
// src/features/ticket/components/ticket-upsert-form.tsx (excerpt)
const [actionState, formAction] = useActionState(
  upsertTicket.bind(null, ticket?.id),
  { message: "" }
);

return (
  <form action={formAction} className="flex flex-col gap-y-2">
    {/* inputs */}
    <SubmitButton label={ticket ? "Edit" : "Create"} />
    {actionState.message}
  </form>
);
```

### 1) Client wrapper + `form.reset()`

Call the native `HTMLFormElement.reset()` when the action reports a success state. Works with or without JS (no-JS users still navigate or see a fresh render).

```tsx
// src/features/ticket/components/ticket-upsert-form.tsx (pattern)
"use client";
import { useActionState, useEffect, useRef } from "react";
import { SubmitButton } from "@/components/form/submit-button";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";

export function TicketUpsertForm({ ticket }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(
    upsertTicket.bind(null, ticket?.id),
    { message: "" }
  );

  useEffect(() => {
    if (state.message === "Ticket created") {
      formRef.current?.reset();
    }
  }, [state.message]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-y-2">
      {/* inputs */}
      <SubmitButton label={ticket ? "Edit" : "Create"} />
      {state.message}
    </form>
  );
}
```

Pros: Minimal, explicit, and does not require changing the action. Cons: Client-only enhancement (no-JS users rely on full navigation/refresh).

### 2) Re-mount form with a `key`

Changing the `key` forces React to recreate the subtree (fresh uncontrolled inputs):

```tsx
export function TicketUpsertForm({ ticket }) {
  const [state, formAction] = useActionState(
    upsertTicket.bind(null, ticket?.id),
    { message: "" }
  );

  // bump the key when we see a success message
  const formKey = state.message === "Ticket created" ? Date.now() : 0;

  return (
    <form key={formKey} action={formAction} className="flex flex-col gap-y-2">
      {/* inputs */}
      <SubmitButton label={ticket ? "Edit" : "Create"} />
      {state.message}
    </form>
  );
}
```

Pros: Pure React approach, no refs. Cons: Re-mounts every time the condition flips; ensure the condition is precise.

### 3) Redirect after submit (navigational reset)

Navigating away gives you a fresh page (and form). We already do this for edit:

```ts
// inside upsert-ticket
if (id) {
  redirect(ticketPath(id));
}
```

You can also redirect somewhere after create (e.g., to the detail page or a success route). Trade-off: you won’t stay on the list page.

### Notes on controlled vs uncontrolled inputs

- Our inputs use `defaultValue` (uncontrolled), so `reset()` or re-mounting clears them naturally.
- If you use controlled inputs (`value` + state), also reset the controlling state after success.

### Recommended approach

- Keep the action deciding success vs failure (server-first).
- For create-on-same-page UX, use (1) or (2) to clear inputs when `message === "Ticket created"`.
- For edit, a redirect is often best (already implemented).

### Checklist

- Server returns an explicit success signal (e.g., `message: "Ticket created"`).
- Client listens for the success signal and resets: `form.reset()` or re-mount with `key`.
- Prevent duplicate submits with `useFormStatus` (already in `SubmitButton`).
- Revalidate relevant routes in the action (already implemented).

These patterns keep forms robust without JS and delightful with it.
