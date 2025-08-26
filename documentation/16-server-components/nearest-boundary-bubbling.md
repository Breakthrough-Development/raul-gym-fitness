## Nearest boundary bubbling

In the App Router, suspensions and errors "bubble" to the nearest boundary that can handle them. There are two kinds of boundaries:

- **Component-level**: `<Suspense>` for suspensions, component Error Boundaries for errors.
- **Route-segment-level files**: `loading.tsx` (suspense at segment level), `error.tsx` (uncaught errors), and `not-found.tsx` (404s via `notFound()`).

### Bubbling rules

- **Suspense (promises)**: A suspended subtree resolves to the nearest `<Suspense>` parent. If a whole route segment is still loading (e.g., first navigation), Next.js shows that segment's `loading.tsx`. Once the segment is active, inner `<Suspense>` fallbacks control smaller subtrees.
- **Errors**: Errors thrown during render/data fetching bubble to the nearest component Error Boundary first. If none is present, they bubble to the closest `error.tsx` in the route hierarchy. If still unhandled, they continue upwards.
- **Not found**: Calling `notFound()` short-circuits rendering and shows the nearest `not-found.tsx`. This bypasses `<Suspense>` and component Error Boundaries for that render.

### How this repo is set up

- `app/tickets/page.tsx` wraps the list with a component-level Error Boundary and `<Suspense>`:

```tsx
import Heading from "@/components/heading";
import TicketList from "@/features/ticket/components/ticket-list";
import { Spinner } from "@/components/spiner";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Placeholder from "@/components/placeholder";

export default async function TicketsPage() {
  return (
    <section className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Tickets Page"
        description="All your tickets at one place."
      />

      <ErrorBoundary fallback={<Placeholder label="Error loading tickets" />}>
        <Suspense fallback={<Spinner />}>
          <TicketList />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
```

Effects:

- If `TicketList` suspends, the spinner shows (nearest `<Suspense>`).
- If `TicketList` throws, the placeholder shows (nearest component Error Boundary).
- If an error happens outside that boundary, `app/tickets/error.tsx` takes over.

- `app/tickets/[ticketId]/loading.tsx` shows while that dynamic segment is still loading on navigation:

```tsx
import { Spinner } from "@/components/spiner";

export default function TicketPageLoading() {
  return <Spinner />;
}
```

- Missing tickets call `notFound()` in `app/tickets/[ticketId]/page.tsx`, which renders the nearest `not-found.tsx`:

```tsx
import { getTicket } from "@/features/ticket/queries/get-ticket";
import { notFound } from "next/navigation";

export default async function TicketPage({ params }) {
  const { ticketId } = await params;
  const ticket = await getTicket(Number(ticketId));
  if (!ticket) return notFound();
  // ...
}
```

### Practical tips

- Use `<Suspense>` to stream smaller parts of a page; keep `loading.tsx` for coarse segment-level loading.
- Place component Error Boundaries around risky subtrees; keep `error.tsx` as a safety net.
- Prefer `notFound()` (+ `not-found.tsx`) for missing resources over throwing errors.
- Boundaries compose: a page can have both `loading.tsx` and nested `<Suspense>` for fine-grained loading UX.

### References

- Loading UI and streaming: `https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming`
- Error handling: `https://nextjs.org/docs/app/building-your-application/routing/error-handling`
- Not Found: `https://nextjs.org/docs/app/api-reference/file-conventions/not-found`
