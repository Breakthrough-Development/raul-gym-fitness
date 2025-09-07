## Action Callback for Forms

Trigger side effects in response to server action results without over-coupling UI and networking.

### What is it? (Theory)

Server actions return a lightweight `ActionState` describing `status`, messages, and field errors. An action callback pattern observes that state on the client and runs side effects when status changes (e.g., show toasts, close dialogs, track analytics) without embedding that logic into the action or form submit handler.

### Pros and Cons

- **Pros**
  - Clear separation: server mutates, client reacts
  - Reusable hook; consistent success/error handling
  - No prop drilling; reacts to state changes
- **Cons**
  - One more abstraction to learn
  - Must ensure effect dependencies are correct

### Example (what we implemented)

We use `useActionState` to invoke the server action and a small `useActionFeedback` hook to react to SUCCESS/ERROR.

```tsx
// src/components/form/hooks/use-action-feedback.ts
import { useEffect, useRef } from "react";
import { ActionState } from "../util/to-action-state";

type OnArgs = {
  actionState: ActionState;
};

type UseActionFeedbackOptions = {
  onSuccess?: (onArgs: OnArgs) => void;
  onError?: (onArgs: OnArgs) => void;
};

export function useActionFeedback(
  actionState: ActionState,
  options: UseActionFeedbackOptions
) {
  const previousTimestampRef = useRef(actionState.timestamp);
  const isNewResult = previousTimestampRef.current !== actionState.timestamp;

  useEffect(() => {
    if (!isNewResult) return;

    if (actionState.status === "SUCCESS") {
      options.onSuccess?.({ actionState });
    }
    if (actionState.status === "ERROR") {
      options.onError?.({ actionState });
    }

    previousTimestampRef.current = actionState.timestamp;
  }, [actionState, options, isNewResult]);
}
```

```tsx
// src/features/ticket/components/ticket-upsert-form.tsx
"use client";
import { useActionState } from "react";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { useActionFeedback } from "@/components/form/hooks/use-action-feedback";

export function TicketUpsertForm({ ticket }: { ticket?: Ticket }) {
  const [actionState, formAction] = useActionState(
    upsertTicket.bind(null, ticket?.id),
    EMPTY_ACTION_STATE
  );

  useActionFeedback(actionState, {
    onSuccess: () => {
      console.log("Action successful");
      // e.g., show toast, close modal, reset form, refetch client data
    },
    onError: ({ actionState }) => {
      console.log("Action error", actionState.message);
      // e.g., show toast, focus first invalid field
    },
  });

  return <form action={formAction}>{/* inputs... */}</form>;
}
```

### Why this helps

- Keeps server actions pure (validation, mutation, navigation)
- Side effects live in the client where they belong
- Works naturally with `ActionState` updates from `useActionState`

### Folder structure (relevant parts)

```
src/
├── components/
│   └── form/
│       ├── hooks/
│       │   └── use-action-feedback.ts
│       └── util/
│           └── to-action-state.ts
└── features/
    └── ticket/
        ├── actions/
        │   └── upsert-ticket.tsx
        └── components/
            └── ticket-upsert-form.tsx
```

### Notes

- Keep callbacks small and idempotent; avoid heavy logic inside effects
- Consider toasts, focus management, and analytics as typical callbacks
- For complex flows, centralize feedback in a UI store rather than per-form
- Guard callback execution using `actionState.timestamp` so effects don't fire on initial render or for unchanged results. Compare against a ref and update it after handling.
- Ensure your action helpers set a fresh `timestamp` on every new result (both success and error) so the guard works reliably.
