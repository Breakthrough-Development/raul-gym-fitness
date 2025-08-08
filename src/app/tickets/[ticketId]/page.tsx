export type TicketPageProps = {
  params: {
    ticketId: string;
  };
};

export default function TicketPage({ params }: TicketPageProps) {
  return (
    <div>
      <h1>Ticket {params.ticketId}</h1>
    </div>
  );
}
