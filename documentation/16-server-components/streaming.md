## Streaming

Streaming lets the server send HTML to the client in chunks as data becomes available, so users see the page shell immediately while slower parts load in later. In the App Router, Server Components can suspend during data fetching, and React/Next.js stream the completed parts as they resolve.

> Streaming is especially useful for pages with slower data requirements. Rather than blocking the entire page render until all data is ready, we can show a fast-loading shell while streaming in the content-heavy sections as they complete.

### What we implemented

- **Boundary placement**: We wrapped the tickets list in a React `Suspense` boundary inside the page Server Component. This allows the header and layout to render first, then the list streams in when its data resolves.

```tsx
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
```

- **Async Server Component**: `TicketList` fetches data on the server, suspending the boundary until the tickets resolve. Once ready, React streams the list into the already-rendered shell.

```tsx
import { getTickets } from "../queries/get-tickets";
import TicketItem from "./ticket-item";

export default async function TicketList() {
  const tickets = await getTickets();
  return (
    <ul className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
      {tickets.map((ticket) => (
        <TicketItem key={ticket.id} ticket={ticket} />
      ))}
    </ul>
  );
}
```

### Fallback UI (optional but recommended)

By default, `Suspense` without a `fallback` streams nothing in the boundary area until it resolves. Providing a small, fast-loading skeleton improves perceived performance:

```tsx
<Suspense
  fallback={
    <div className="text-sm text-muted-foreground">Loading tickets…</div>
  }
>
  <TicketList />
</Suspense>
```

You can also extract a proper skeleton component if you prefer.

### Pairing with Error Boundaries

To handle unexpected errors during render/data fetching inside a streamed boundary, pair `Suspense` with an Error Boundary. In our Tickets page we wrap the list with an Error Boundary that shows a friendly placeholder if something goes wrong:

```tsx
import { ErrorBoundary } from "react-error-boundary";
import Placeholder from "@/components/placeholder";
import { Spinner } from "@/components/spiner";

<ErrorBoundary fallback={<Placeholder label="Error loading tickets" />}>
  <Suspense fallback={<Spinner />}>
    <TicketList />
  </Suspense>
</ErrorBoundary>;
```

### Why this boundary works well here

- **Shell-first render**: Header and layout paint immediately; the list arrives later.
- **Server-only data fetching**: `TicketList` is a Server Component, so no client JS is needed to fetch or render the list HTML.
- **Smooth UX**: With a fallback, users get immediate visual feedback.

### Tips and extensions

- Add more boundaries to stream other slow sections independently (e.g., filters, stats).
- Keep fallbacks light; avoid heavy spinners or layout shift.
- For detail pages, you can selectively add boundaries where parts can load independently.

### Verify streaming

- Run the app in development, open the Network tab, throttle to Slow 3G, and navigate to the Tickets page. You should see the shell render first, then the tickets list appear.

### Further reading

- React Suspense and streaming in the App Router: `https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming`
