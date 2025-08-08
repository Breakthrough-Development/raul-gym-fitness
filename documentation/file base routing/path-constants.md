## Path utilities (`src/paths.ts`)

Centralize route generation in one place to make refactors safe and easy. Instead of scattering hardcoded strings like "/tickets" across the codebase, use small functions that return paths. Even static paths are functions to keep the call sites consistent.

### Why

- **Single source of truth**: Change a route in one file and it propagates everywhere.
- **Consistency**: Every `href` is constructed the same way, reducing mistakes.
- **Flexibility**: Dynamic segments and query strings are handled where they belong.

### Current API

```ts
// src/paths.ts
export const ticketsPath = () => "/tickets";
export const ticketPath = (ticketId: string) => `/tickets/${ticketId}`;
```

### Usage

- **Home → Tickets**

```tsx
// src/app/page.tsx
import { ticketsPath } from "@/paths";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Hello World!!!</h1>
      <Link href={ticketsPath()}>Tickets</Link>
    </div>
  );
}
```

- **Tickets list → Ticket details**

```tsx
// src/app/tickets/page.tsx
import initialTickets from "@/tickets.data";
import Link from "next/link";
import { ticketPath } from "@/paths";

export default function TicketsPage() {
  return (
    <div>
      <ul>
        {initialTickets.map((ticket) => (
          <li key={ticket.id}>
            <h2>{ticket.title}</h2>
            <Link href={ticketPath(ticket.id.toString())}>
              View <span className="sr-only">ticket {ticket.id}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- **Ticket details → Back to Tickets**

```tsx
// src/app/tickets/[ticketId]/page.tsx
import initialTickets from "@/tickets.data";
import Link from "next/link";
import { ticketsPath } from "@/paths";

export default function TicketPage({
  params,
}: {
  params: { ticketId: string };
}) {
  const ticketId = Number(params.ticketId);
  const ticket = initialTickets.find((t) => t.id === ticketId);
  if (!ticket) {
    return (
      <section>
        <h1>Ticket not found</h1>
        <Link href={ticketsPath()}>Back to tickets page</Link>
      </section>
    );
  }
  return (
    <section>
      <h2>{ticket.title}</h2>
      <p>{ticket.content}</p>
      <p>{ticket.status}</p>
      <Link href={ticketsPath()}>Back to tickets page</Link>
    </section>
  );
}
```

### Conventions

- **Always export functions**, even for static paths (e.g., `aboutPath()`), to keep usage uniform.
- **Accept primitive params** for dynamic segments. Convert numbers to strings at the call site when needed.
- **No hardcoded `href` strings** in components. Import from `src/paths.ts` instead.
- **Avoid trailing slashes** unless required.

### Extending

Add paths in `src/paths.ts` as your routes grow:

```ts
export const aboutPath = () => "/about";
export const usersPath = () => "/users";
export const userPath = (userId: string) => `/users/${userId}`;

// Optional: helpers for query strings
export const ticketsSearchPath = (query: { status?: string }) => {
  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);
  return `/tickets?${params.toString()}`;
};
```

This keeps navigation consistent and future refactors low-risk.
