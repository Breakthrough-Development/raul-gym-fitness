import Heading from "@/components/heading";
import TicketList from "@/features/ticket/components/ticket-list";
import { Spinner } from "@/components/spiner";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Placeholder from "@/components/placeholder";
import { CardComp } from "@/components/card-comp";
import { TicketUpsertForm } from "@/features/ticket/components/ticket-upsert-form";
import { RedirectToast } from "@/components/redirect-toast";

export default async function TicketsPage() {
  return (
    <>
      <section className="flex-1 flex flex-col gap-y-8">
        <Heading
          title="Tickets Page"
          description="All your tickets at one place."
        />

        <CardComp
          title="Tickets"
          description="All your tickets at one place."
          content={<TicketUpsertForm />}
          className="w-full max-w-[420px] self-center"
        ></CardComp>

        <ErrorBoundary fallback={<Placeholder label="Error loading tickets" />}>
          <Suspense fallback={<Spinner />}>
            <TicketList />
          </Suspense>
        </ErrorBoundary>
      </section>
      <RedirectToast />
    </>
  );
}
