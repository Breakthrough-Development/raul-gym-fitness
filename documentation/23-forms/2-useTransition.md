## useTransition for Forms and Server Actions

Use `useTransition` to keep your UI responsive while running async work (like Server Actions) triggered by client events. It schedules the update with lower priority so inputs remain snappy and renders can be interrupted.

### TL;DR

- Prefer native `<form action={serverAction}>` and `useFormStatus` for pending state inside forms.
- Use `useTransition` for imperative triggers (buttons, onChange), optimistic UI, or work outside a form.
- Treat transitions as non-blocking: disable buttons, show progress, avoid blocking input.

### When to use `useTransition`

- You trigger a Server Action from a client event (e.g., onClick) instead of a form submit.
- You want to keep typing/scrolling responsive while an async mutation runs.
- You need optimistic UI or partial UI updates without a full navigation.
- You want a shared pending state that spans multiple components.

### `useTransition` vs `useFormStatus`

- `useFormStatus` works only inside the submitted form; it provides pending state scoped to that form submission.
- `useTransition` is general-purpose; use it anywhere in a client component to schedule low-priority updates and track `pending`.

### Example 1: Imperative submit with `useTransition`

This pattern lets you call a Server Action from a client component and control pending UI yourself.

```tsx
// src/features/ticket/components/TicketUpsertClient.tsx
"use client";
import { useRef, useTransition } from "react";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";

type Props = { id?: string };

export function TicketUpsertClient({ id }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        startTransition(async () => {
          await upsertTicket(id, data);
          form.reset();
        });
      }}
      className="flex flex-col gap-y-2"
    >
      {/* your labeled inputs here (Title, Content, etc.) */}
      <button type="submit" disabled={isPending} aria-busy={isPending}>
        {isPending ? "Saving..." : id ? "Edit" : "Create"}
      </button>
    </form>
  );
}
```

Notes:

- Import the Server Action directly into a client component and invoke it inside `startTransition`.
- Keep the UI responsive; prevent duplicate submits while `isPending` is true.

### Example 2: Item-level actions (no form)

Good for actions like archive/complete/delete from a list item without a form submit.

```tsx
// src/features/ticket/components/TicketListItemActions.tsx
"use client";
import { useTransition } from "react";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";

export function TicketListItemActions({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          const data = new FormData();
          data.set("title", "Updated title");
          data.set("content", "Updated content");
          await upsertTicket(id, data);
        })
      }
      disabled={isPending}
      aria-busy={isPending}
    >
      {isPending ? "Updating..." : "Quick Update"}
    </button>
  );
}
```

### Example 3: Compare with `useFormStatus`

Inside a form that uses `action={upsertTicket.bind(...)}`, prefer `useFormStatus` for the submit button.

```tsx
// app/components/SubmitButton.tsx
"use client";
import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      aria-busy={pending}
    >
      {pending ? "Saving..." : children}
    </button>
  );
}
```

Use this inside your existing server form:

```tsx
// inside TicketUpsertForm
<SubmitButton>{ticket ? "Edit" : "Create"}</SubmitButton>
```

When to choose which:

- If you already use `<form action={...}>`, choose `useFormStatus`.
- If you need to trigger actions outside a form or coordinate multiple updates, choose `useTransition`.

### Best practices

- Disable controls while pending; set `aria-busy` for a11y.
- Keep actions idempotent so retries are safe.
- Centralize cache invalidation and redirects in the Server Action.
- For optimistic UI, update local state inside `startTransition` before awaiting the action.
- Avoid nesting many transitions; one per interaction is usually enough.

### Pitfalls

- Don’t block the main render with heavy synchronous work before `startTransition`.
- Don’t rely on `useTransition` inside server components (it’s client-only).
- Don’t import Server Actions into shared libraries intended for the server-only runtime.

### Summary

`useTransition` complements Server Actions. Use it to trigger actions imperatively and keep the UI responsive. For form submissions, prefer the native `<form action>` flow and `useFormStatus`; reach for `useTransition` when your interaction pattern isn’t a simple form submit or when you need optimistic UI and shared pending state.
