## Edit Form with Server Actions

A small, focused example showing how to edit an existing ticket using a client-side form and a server action.

### TL;DR

- Render a form prefilled with the current ticket.
- On submit, call a server action that updates the row, revalidates the list, and redirects.

### 1) Server action: update the ticket

```ts
"use server";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const updateTicket = async (id: string, formData: FormData) => {
  const data = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  };

  await prisma.ticket.update({
    where: { id },
    data: { title: data.title, content: data.content },
  });

  revalidatePath(ticketsPath());
  redirect(ticketsPath());
};

export { updateTicket };
```

### 2) Client form: bind the action and prefill values

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateTicket } from "@/features/ticket/actions/update-ticket";
import { Ticket } from "@prisma/client";

type TicketUpdateFormProps = { ticket: Ticket };

const TicketUpdateForm = ({ ticket }: TicketUpdateFormProps) => (
  <form
    action={updateTicket.bind(null, ticket.id)}
    className="flex flex-col gap-y-2"
  >
    <Label htmlFor="title">Title</Label>
    <Input id="title" name="title" type="text" defaultValue={ticket.title} />

    <Label htmlFor="content">Content</Label>
    <Textarea id="content" name="content" defaultValue={ticket.content} />

    <Button type="submit">Update</Button>
  </form>
);

export { TicketUpdateForm };
```

### 3) Route: fetch ticket and render the form

```tsx
import { CardComp } from "@/components/card-comp";
import { TicketUpdateForm } from "@/features/ticket/components/ticket-update-form";
import { getTicket } from "@/features/ticket/queries/get-ticket";
import { notFound } from "next/navigation";

export type TicketEditPageProps = { params: Promise<{ ticketId: string }> };

const TicketEditPage = async ({ params }: TicketEditPageProps) => {
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);
  if (!ticket) return notFound();
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <CardComp
        title="Edit Ticket"
        description="Edit your ticket"
        className="w-full max-w-[420px] animate-fade-in-from-top"
        content={<TicketUpdateForm ticket={ticket} />}
      />
    </div>
  );
};

export default TicketEditPage;
```

### Notes

- Binding `updateTicket` with `ticket.id` encodes the intended row on the server, avoiding hidden inputs.
- `revalidatePath` ensures the tickets list shows the latest data after update.
- `redirect` gives a clean post-submit UX.
