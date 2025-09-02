import Heading from "@/components/heading";
import TicketList from "@/features/ticket/components/ticket-list";
import { Spinner } from "@/components/spiner";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Placeholder from "@/components/placeholder";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { TicketCreateForm } from "@/features/ticket/components/ticket-create-form";

export default async function TicketsPage() {
  return (
    <section className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Tickets Page"
        description="All your tickets at one place."
      />

      <Card className="w-full max-w-[420px] self-center">
        <CardHeader>
          <CardTitle>Tickets</CardTitle>
          <CardDescription>All your tickets at one place.</CardDescription>
        </CardHeader>
        <CardContent>
          <TicketCreateForm />
        </CardContent>
      </Card>

      <ErrorBoundary fallback={<Placeholder label="Error loading tickets" />}>
        <Suspense fallback={<Spinner />}>
          <TicketList />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
