import Heading from "@/components/heading";
import TicketList from "@/features/ticket/components/ticket-list";
import { Suspense } from "react";

export default async function TicketsPage() {
  return (
    <section className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Tickets Page"
        description="All your tickets at one place."
      />

      <div>
        <Suspense>
          <TicketList />
        </Suspense>
      </div>
    </section>
  );
}
