## Extracting route logic into the feature folder

Keep `app/` focused on routing and move reusable, domain-specific pieces into `src/features/<feature>`.

### What to extract

- UI components tied to a feature (e.g., ticket list item)
- Domain constants and example data
- Types and interfaces
- Hooks and data fetching

### Example: Tickets page extraction

Original `app/tickets/page.tsx` contained list item markup and icon logic. We extracted those into a feature component and constants:

```1:26:src/features/ticket/components/ticket-item.tsx
import { TICKET_ICONS } from "../constants";
import type { Ticket } from "../types";

export type TicketItemProps = {
  ticket: Ticket;
};

const TicketItem = ({ ticket }: TicketItemProps) => {
  return (
    <Card key={ticket.id} className="w-full max-w-[420px]">
      <CardHeader>
        <CardTitle className="flex gap-x-2">
          <span>{TICKET_ICONS[ticket.status]}</span>
          <span className="truncate">{ticket.title}</span>
        </CardTitle>
      </CardHeader>
      {/* ... */}
    </Card>
  );
}
```

Constants colocated under the feature:

```1:12:src/features/ticket/constants.tsx
import type { Ticket } from "./types";
import { LucideCircleCheck, LucideFileText, LucidePencil } from "lucide-react";

export const TICKET_STATUSES = ["OPEN", "IN_PROGRESS", "DONE"] as const;

export const EXAMPLE_TICKETS: Ticket[] = [
  { id: 1, title: "Ticket 1", content: "This is the first ticket", status: "DONE" },
  { id: 2, title: "Ticket 2", content: "This is the second ticket", status: "OPEN" },
];

export const TICKET_ICONS = {
  OPEN: <LucideFileText />,
  IN_PROGRESS: <LucidePencil />,
  DONE: <LucideCircleCheck />,
};
```

Route becomes lean, importing the feature component:

```1:10:src/app/tickets/page.tsx
import TicketItem from "@/features/ticket/components/ticket-item";

export default function TicketsPage() {
  return (
    <ul>
      {initialTickets.map((ticket) => (
        <TicketItem key={ticket.id} ticket={ticket} />
      ))}
    </ul>
  );
}
```

### Guidelines

- Keep exports stable: `index.ts` barrels under `components/` if grouping many pieces
- Use feature-local types from `src/features/<feature>/types`
- Avoid importing from `app/` inside features
- Prefer `lucide-react` or inline SVGs within the feature for icons
- Test feature components in isolation where possible
