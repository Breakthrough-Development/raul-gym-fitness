import Link from "next/link";
import { ticketsPath } from "@/paths";
import type { Route } from "next";
import Placeholder from "@/components/placeholder";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Placeholder
      label="Ticket not found"
      button={
        <Button asChild variant="outline">
          <Link href={ticketsPath() as Route}>Back to tickets</Link>
        </Button>
      }
    />
  );
}
