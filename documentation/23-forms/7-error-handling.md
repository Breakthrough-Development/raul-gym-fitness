## Error Handling for Server Actions (Forms)

Make errors reliable first (server) and friendly second (client). Our pattern centralizes errors in the Server Action, converts them to a serializable state, and renders them inline via `useActionState`.

### Goals

- Single source of truth: validate and classify errors on the server
- Serializable state: return simple objects (strings, numbers, objects)
- Progressive enhancement: works with and without JavaScript

### Our helper: error → action state

```ts
// src/components/form/to-action-state.ts
import { ZodError } from "zod";

export type ActionState = { message: string; payload?: FormData };

export const formErrorToActionState = (
  error: unknown,
  formData?: FormData
): ActionState => {
  if (error instanceof ZodError) {
    return {
      message: error.issues[0].message,
      payload: formData,
    };
  } else if (error instanceof Error) {
    return {
      message: error.message,
      payload: formData,
    };
  } else {
    return { message: "An unknown error occurred", payload: formData };
  }
};
```

What this gives us:

- A consistent shape `{ message, payload? }` for the client
- Optional `payload` lets us re-populate inputs after a failed submission

### Using it in a Server Action

```ts
// src/features/ticket/actions/upsert-ticket.tsx (excerpt)
"use server";
import z from "zod";
import {
  ActionState,
  formErrorToActionState,
} from "@/components/form/to-action-state";

const upsertTicketSchema = z.object({
  title: z.string().min(1).max(191),
  content: z.string().min(1).max(1024),
});

const upsertTicket = async (
  id: string | undefined,
  _actionState: ActionState,
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
    return formErrorToActionState(error, formData);
  }

  revalidatePath(ticketsPath());
  if (!id) return { message: "Ticket created" };
  redirect(ticketPath(id));
  return { message: "Ticket updated" };
};
```

Notes:

- Zod validation errors and generic Errors both become `{ message, payload }`
- Edit redirects (navigational reset); create returns a message (render-in-place)

### Rendering errors in the form

```tsx
// src/features/ticket/components/ticket-upsert-form.tsx (excerpt)
"use client";
import { useActionState } from "react";
import { SubmitButton } from "@/components/form/submit-button";

const [state, formAction] = useActionState(
  upsertTicket.bind(null, ticket?.id),
  {
    message: "",
  }
);

<form action={formAction} className="flex flex-col gap-y-2">
  {/* inputs */}
  <SubmitButton label={ticket ? "Edit" : "Create"} />
  {state.message && (
    <p role="alert" className="text-sm text-destructive">
      {state.message}
    </p>
  )}
</form>;
```

Optional: repopulate fields from `state.payload` when an error occurs (helpful after Zod errors):

```tsx
const titleDefault =
  state.payload?.get("title")?.toString() ?? ticket?.title ?? "";
<Input id="title" name="title" defaultValue={titleDefault} />;
```

### Field-level errors (extensible pattern)

If you need per-field messages, return a structured state `{ errors: { field: message } }` and render near inputs (see the validation doc for a full example).

### Best practices

- Keep server validation as the source of truth; client hints are optional
- Return only serializable values in action state
- Pair with `useFormStatus` to disable submit while pending
- Log unexpected errors on the server; show friendly messages to users

### Common pitfalls

- Throwing raw errors instead of returning state → nothing renders inline
- Returning non-serializable types → hydration/serialization issues
- Losing user input after errors → keep/restore values via `payload`

This pattern gives you robust, user-friendly error handling: reliable on the server, progressively enhanced in the client.
