import { Breadcrumbs } from "@/components/breadcrumbs";
import { CardComp } from "@/components/card-comp";
import { TicketUpsertForm } from "@/features/ticket/components/ticket-upsert-form";
import { getTicket } from "@/features/ticket/queries/get-ticket";
import { ticketPath, ticketsPath } from "@/paths";
import { Separator } from "@radix-ui/react-separator";
import { notFound } from "next/navigation";

export type TicketEditPageProps = {
  params: Promise<{ ticketId: string }>;
};

const TicketEditPage = async ({ params }: TicketEditPageProps) => {
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);

  const isTicketFound = !!ticket;
  if (!isTicketFound || !ticket.isOwner) {
    return notFound();
  }

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Breadcrumbs
        breadCrumbs={[
          { title: "Tickets", href: ticketsPath() },
          { title: ticket.title, href: ticketPath(ticket.id) },
          { title: "Edit" },
        ]}
      />

      <Separator />

      <div className="flex-1 flex flex-col justify-center items-center">
        <CardComp
          title="Edit Ticket"
          description="Edit your ticket"
          className="w-full max-w-[420px] animate-fade-in-from-top  "
          content={<TicketUpsertForm ticket={ticket} />}
        />
      </div>
    </div>
  );
};

export default TicketEditPage;
