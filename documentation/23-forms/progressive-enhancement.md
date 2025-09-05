## Progressive enhancement for forms

**Goal**: When JavaScript is disabled, form submissions should still create/update data and navigate using standard HTTP redirects.

### What we have

- **Server Action path (JS on)**: `TicketUpsertForm` posts via `action={upsertTicket.bind(null, ticket?.id)}` which calls `upsertTicket` on the server, invalidates cache with `revalidatePath`, and uses `redirect` on edit.

### Current limitation

- **With JS off**: Server Actions–backed forms are not yet reliably progressive-enhanced in production. Submissions may fail or not navigate as expected. The Next.js team is working on improving this.

### Recommended fallback (until native PE is reliable)

1. Keep the existing Server Action form for the JS-on experience:

```tsx
<form
  action={upsertTicket.bind(null, ticket?.id)}
  className="flex flex-col gap-y-2"
>
  <input type="hidden" name="id" value={ticket?.id ?? ""} />
  {/* title, content, submit... */}
  {/* Server-Action submit remains the default when JS is enabled */}
  <button type="submit">{ticket ? "Edit" : "Create"}</button>

  {/* No-JS fallback button overrides target using formAction/formMethod */}
  <noscript>
    <button type="submit" formMethod="post" formAction="/tickets/pe">
      {ticket ? "Edit" : "Create"}
    </button>
  </noscript>
  {/* Optionally, add a note for no-JS users in <noscript> */}
  <noscript>
    <p>Submitting will reload the page.</p>
  </noscript>
  {/* ...fields... */}
</form>
```

2. Add a simple Route Handler to process the no-JS submission. It mirrors `upsertTicket` but returns a standard HTTP redirect:

```ts
// app/tickets/pe/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ticketsPath, ticketPath } from "@/paths";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const formData = await req.formData();
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString() ?? "";
  const content = formData.get("content")?.toString() ?? "";

  await prisma.ticket.upsert({
    where: { id: id ?? "" },
    update: { title, content },
    create: { title, content },
  });

  // Keep cache coherent with the JS-on path
  revalidatePath(ticketsPath());

  const url = id ? ticketPath(id) : ticketsPath();
  return NextResponse.redirect(new URL(url, req.url), 303);
}
```

3. Validation options

- **JS on (Server Action)**: Return structured errors and display them with `useFormState`.
- **No JS (Route Handler)**: Use PRG (Post/Redirect/Get). Redirect back to the form with query params (e.g., `?error=title`) or to a confirmation page. Render any messages on the GET response.

### How to test

- Disable JavaScript in your browser devtools, reload the page, submit the form:
  - Creation should redirect to the list page.
  - Editing should redirect to the ticket detail page.
  - Caches should reflect changes due to `revalidatePath`.

### Notes

- Keep the Server Action path as your primary experience. The fallback ensures functional behavior for users (or environments) without JS until native progressive enhancement for Server Actions is fully reliable.
