## Cookies for post-redirect toasts

This change adds an ephemeral, cookie-based success message that survives a server-action redirect and is displayed as a toast on the destination page.

### What changed

- Added cookie helpers in `src/actions/cookies.ts`
- Added client component `src/components/redirect-toast.tsx` to read-and-consume the cookie and show a toast
- Updated ticket actions to set the toast cookie before redirecting
- Mounted `<RedirectToast />` on tickets pages so messages appear after navigation

### Why

Server actions often redirect after mutations. We want to show one-time feedback on the next page without threading client state. Cookies provide a simple server-to-client handoff.

### Flow

1. Server action performs the mutation
2. Server action sets a short-lived cookie `toast` with a success message
3. Server action redirects to the target route
4. On the destination page, a client component reads and consumes the cookie; if present, it shows a toast

### Cookie utilities

```1:33:src/actions/cookies.ts
"use server";

import { cookies } from "next/headers";

export const getCookieByKey = async (key: string): Promise<string | null> => {
  const cookie = (await cookies()).get(key);

  if (!cookie) {
    return null;
  }

  return cookie.value;
};

export const setCookieByKey = async (
  key: string,
  value: string
): Promise<void> => {
  (await cookies()).set(key, value);
};

export const deleteCookieByKey = async (key: string): Promise<void> => {
  (await cookies()).delete(key);
};

export const consumeCookiedByKey = async (key: string) => {
  const message = await getCookieByKey(key);

  await deleteCookieByKey(key);

  return message;
};
```

### Client toast reader

Reads the `toast` cookie, deletes it, and shows it once using `sonner`.

```1:23:src/components/redirect-toast.tsx
"use client";

import { consumeCookiedByKey } from "@/actions/cookies";
import { useEffect } from "react";
import { toast } from "sonner";

const RedirectToast = () => {
  useEffect(() => {
    const showCookieToast = async () => {
      const message = await consumeCookiedByKey("toast");

      if (message) {
        toast.success(message);
      }
    };
    showCookieToast();
  }, []);

  return null;
};

export { RedirectToast };
```

### Server actions

Set a `toast` cookie before redirecting so the next page can show feedback.

Delete ticket:

```1:18:src/features/ticket/actions/delete-ticket.ts
"use server";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { setCookieByKey } from "@/actions/cookies";

export const deleteTicket = async (id: string) => {
  await prisma.ticket.delete({
    where: { id },
  });

  revalidatePath(ticketsPath());
  await setCookieByKey("toast", "Ticket deleted");
  redirect(ticketsPath());
};
```

Upsert ticket (create or update):

```1:50:src/features/ticket/actions/upsert-ticket.tsx
"use server";

import { prisma } from "@/lib/prisma";
import { ticketPath, ticketsPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";
import {
  ActionState,
  formErrorToActionState,
  toActionState,
} from "@/components/form/util/to-action-state";
import { setCookieByKey } from "@/actions/cookies";

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
      title: formData.get("title"),
      content: formData.get("content"),
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

  if (id) {
    await setCookieByKey("toast", "Ticket updated");
    redirect(ticketPath(id));
  }
  return toActionState("SUCCESS", "Ticket Created");
};

export { upsertTicket };
```

### Mounting the toast reader

`<RedirectToast />` is rendered on tickets pages so messages appear after navigation.

```1:14:src/app/tickets/page.tsx
import { RedirectToast } from "@/components/redirect-toast";
// ... existing code ...
```

```19:25:src/app/tickets/[ticketId]/page.tsx
      <RedirectToast />
```

### Behavior notes

- The cookie is consumed (deleted) after being read to avoid duplicate toasts
- Works with server-side redirects; only the toast display itself requires client JS
- You can set different messages per operation by changing the `toast` value

### Extending

- If you need expiry, path, or security flags, extend `setCookieByKey` to pass options to `cookies().set(key, value, options)`
- For global coverage, mount `<RedirectToast />` in a shared layout where appropriate

### See also

- Redirect patterns: `documentation/21-redirect.md`
