## Suspense

Suspense lets you declaratively show a lightweight fallback while part of your UI is "suspending" on asynchronous work (e.g., data fetching). In the App Router with Server Components, a component can suspend while awaiting data, and React/Next.js will stream the page shell first, then replace the fallback with the resolved UI when ready.

### What Suspense does

- **Boundary**: Wraps a subtree of your UI so it can load independently of the rest.
- **Fallback**: Renders immediately for that subtree while the wrapped content is waiting.
- **Replace**: When the async work completes, React swaps the fallback with the real UI.
- **Nestable**: You can nest multiple boundaries so slower parts don't block faster parts.

### What we implemented

On the Tickets page, we wrapped the async Server Component `TicketList` with a `Suspense` boundary and provided a small `Spinner` fallback. The header renders immediately; the list streams in when ready.

```tsx
import Heading from "@/components/heading";
import TicketList from "@/features/ticket/components/ticket-list";
import { Spinner } from "@/components/spiner";
import { Suspense } from "react";

export default async function TicketsPage() {
  return (
    <section className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Tickets Page"
        description="All your tickets at one place."
      />

      <Suspense fallback={<Spinner />}>
        <TicketList />
      </Suspense>
    </section>
  );
}
```

The fallback uses a simple spinner component:

```tsx
import { LucideLoaderCircle } from "lucide-react";

function Spinner() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center self-center">
      <LucideLoaderCircle className="h-16 w-16 animate-spin" />
    </div>
  );
}

export { Spinner };
```

### Where to place boundaries

- **Around slow subtrees**: Wrap components that fetch data or do expensive work.
- **Avoid over-wrapping**: Don't hide the entire page behind a single fallback.
- **Independent chunks**: Use multiple boundaries so one slow section doesn't block others.

### Fallback best practices

- Keep it lightweight (small skeletons or subtle spinners).
- Preserve layout to prevent content shift when the real UI appears.
- Keep the fallback visually simple; it should render instantly.

### Suspense vs `loading.tsx`

- **`loading.tsx`**: Route-segment level, shows while the entire segment loads. Coarse-grained.
- **`<Suspense>`**: Component-level, fine-grained control over parts of the UI. Can be nested.
- They can be used together: show a route-level loading state first, then finer-grained fallbacks for slower parts.

### Suspense and streaming

Suspense enables server-side streaming in the App Router. The shell renders first; suspended boundaries stream in as they resolve. See the streaming notes for more: `./streaming.md`.

### Error handling

Suspense fallbacks do not catch errors. Pair with an Error Boundary (e.g., `error.tsx` at the route segment level) to render a friendly error UI if something fails during render/data fetching.

### How to verify

- Throttle the network in DevTools and navigate to the Tickets page.
- You should see the header render immediately and the spinner appear.
- The tickets list replaces the spinner once data resolves.

### Further reading

- React Suspense in App Router: `https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming`
