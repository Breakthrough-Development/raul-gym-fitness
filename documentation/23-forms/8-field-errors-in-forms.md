## Field errors in forms

This pattern shows how to return and render per-field validation errors from Server Actions using `useActionState`, Zod, and a small `FieldError` component.

### 1) Define an action state with field errors

```ts
// src/components/form/util/to-action-state.ts
import { ZodError } from "zod";

export type ActionState = {
  message: string;
  payload?: FormData;
  fieldErrors: Record<string, string[] | undefined>;
};

export const formErrorToActionState = (
  error: unknown,
  formData?: FormData
): ActionState => {
  if (error instanceof ZodError) {
    return {
      message: "",
      fieldErrors: error.flatten().fieldErrors,
      payload: formData,
    };
  } else if (error instanceof Error) {
    return {
      message: error.message,
      fieldErrors: {},
      payload: formData,
    };
  } else {
    return {
      message: "An unknown error occurred",
      fieldErrors: {},
      payload: formData,
    };
  }
};
```

Notes:

- `fieldErrors` is a map of input names to arrays of messages. We show the first one inline.
- `payload` lets us re-populate inputs after a failed submit.

### 2) Return structured errors from the Server Action

```ts
// src/features/ticket/actions/upsert-ticket.tsx (excerpt)
"use server";
import z from "zod";
import {
  ActionState,
  formErrorToActionState,
} from "@/components/form/util/to-action-state";

const upsertTicketSchema = z.object({
  title: z.string().min(1).max(191),
  content: z.string().min(1).max(1024),
});

const upsertTicket = async (
  id: string | undefined,
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> => {
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

  // success
  revalidatePath(ticketsPath());
  if (id) redirect(ticketPath(id));
  return { message: "Ticket updated", fieldErrors: {} };
};
```

### 3) Render field errors next to inputs

```tsx
// src/components/form/field-error.tsx
import { ActionState } from "./util/to-action-state";

type FieldErrorProps = {
  actionState: ActionState;
  name: string;
};

const FieldError = ({ actionState, name }: FieldErrorProps) => {
  const message = actionState.fieldErrors[name]?.[0];
  if (!message) return null;
  return <span className="text-xs text-red-500">{message}</span>;
};

export { FieldError };
```

### 4) Use it in the form with `useActionState`

```tsx
// src/features/ticket/components/ticket-upsert-form.tsx (excerpt)
"use client";
import { useActionState } from "react";
import { FieldError } from "@/components/form/field-error";
import { SubmitButton } from "@/components/form/submit-button";

const [actionState, formAction] = useActionState(
  upsertTicket.bind(null, ticket?.id),
  {
    message: "",
    fieldErrors: {},
  }
);

<form action={formAction} className="flex flex-col gap-y-2">
  <Label htmlFor="title">Title</Label>
  <Input
    id="title"
    name="title"
    type="text"
    defaultValue={
      (actionState.payload?.get("title") as string) ?? ticket?.title
    }
  />
  <FieldError actionState={actionState} name="title" />

  <Label htmlFor="content">Content</Label>
  <Textarea
    id="content"
    name="content"
    defaultValue={
      (actionState.payload?.get("content") as string) ?? ticket?.content
    }
  />
  <FieldError actionState={actionState} name="content" />

  <SubmitButton label={ticket ? "Edit" : "Create"} />

  {actionState.message}
  {/* Optionally render a generic form-level alert here */}
</form>;
```

### Best practices

- Validate on the server; client-side hints are optional.
- Keep fallbacks lightweight and preserve field values via `payload`.
- Show only the first error per field inline; offer a summary if needed.
- Use `useFormStatus` to disable submit and show a small spinner while pending.

### Common pitfalls

- Returning non-serializable values (e.g., Errors) in action state → serialization issues.
- Losing input values after errors → make sure to pass `formData` into `formErrorToActionState` and read from `actionState.payload` for defaults.
- Mixing field and form messages inconsistently → decide a clear place for each.
