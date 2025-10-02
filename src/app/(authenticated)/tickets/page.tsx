import { CardComp } from "@/components/card-comp";
import Heading from "@/components/heading";
import Placeholder from "@/components/placeholder";
import { Spinner } from "@/components/spiner";
import { getAuth } from "@/features/auth/queries/get-auth";
import TicketList from "@/features/ticket/components/ticket-list";
import { TicketUpsertForm } from "@/features/ticket/components/ticket-upsert-form";
import { SearchParams } from "@/features/ticket/search-params";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type TicketsPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function TicketsPage({ searchParams }: TicketsPageProps) {
  const { user } = await getAuth();
  return (
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
          <TicketList userId={user?.id} searchParams={await searchParams} />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
