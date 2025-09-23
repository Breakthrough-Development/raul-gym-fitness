import { CardComp } from "@/components/card-comp";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { TicketUpsertForm } from "@/features/ticket/components/ticket-upsert-form";
import { getTicket } from "@/features/ticket/queries/get-ticket";
import { notFound } from "next/navigation";

export type TicketEditPageProps = {
  params: Promise<{ ticketId: string }>;
};

const TicketEditPage = async ({ params }: TicketEditPageProps) => {
  const { user } = await getAuthOrRedirect();
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);

  const isTicketFound = !!ticket;
  const isTicketOwner = isOwner(user, ticket);
  if (!isTicketFound || !isTicketOwner) {
    return notFound();
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <CardComp
        title="Edit Ticket"
        description="Edit your ticket"
        className="w-full max-w-[420px] animate-fade-in-from-top  "
        content={<TicketUpsertForm ticket={ticket} />}
      />
    </div>
  );
};

export default TicketEditPage;
