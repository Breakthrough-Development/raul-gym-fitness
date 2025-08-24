# Loading Routes

Loading routes in Next.js App Router provide automatic loading states for route segments. When you create a `loading.tsx` file, Next.js automatically wraps that route segment in a Suspense boundary and shows your loading UI while the page is being rendered.

## How Loading Routes Work

1. **Automatic Suspense Boundary**: Next.js wraps the entire route segment with `<Suspense>`
2. **Immediate Display**: The loading UI shows instantly when navigation starts
3. **Async Page Loading**: While the loading UI is shown, the `page.tsx` runs its async operations
4. **Seamless Replacement**: Once the page is ready, the loading UI is replaced with the actual content

## Implementation

We implemented a loading route for individual ticket pages:

```tsx
// src/app/tickets/[ticketId]/loading.tsx
import { Spinner } from "@/components/spiner";

export default function TicketPageLoading() {
  return <Spinner />;
}
```

This loading component displays while the ticket page fetches data:

```tsx
// src/app/tickets/[ticketId]/page.tsx
export default async function TicketPage({ params }: TicketPageProps) {
  const ticketId = Number(params.ticketId);
  const ticket = await getTicket(ticketId); // This async operation triggers the loading state
  // ... rest of component
}
```

## Spinner Component

The loading state uses a reusable spinner component:

```tsx
// src/components/spiner.tsx
import { LucideLoaderCircle } from "lucide-react";

function Spinner() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center self-center">
      <LucideLoaderCircle className="h-16 w-16 animate-spin" />
    </div>
  );
}
```

## Loading Routes vs Suspense

| Loading Routes (`loading.tsx`) | Suspense Boundaries           |
| ------------------------------ | ----------------------------- |
| Route-segment level            | Component level               |
| Coarse-grained control         | Fine-grained control          |
| Automatic by Next.js           | Manual implementation         |
| Shows for entire page          | Shows for specific components |
| Good for page-level loading    | Good for partial UI loading   |

## When to Use Loading Routes

- **Entire page needs data**: When the whole page depends on async operations
- **Simple loading states**: When you want a straightforward loading experience
- **Route-level boundaries**: When loading applies to the entire route segment
- **Consistent UX**: When you want the same loading pattern across similar pages

## Benefits

1. **Zero Configuration**: Just create the file and Next.js handles the rest
2. **Instant Feedback**: Users see loading state immediately
3. **Better UX**: No blank pages during navigation
4. **Streaming Ready**: Works with React's streaming capabilities
5. **Nested Support**: Can be combined with component-level Suspense

## File Structure

```
src/app/
  tickets/
    [ticketId]/
      loading.tsx    ← Route-level loading for /tickets/[ticketId]
      page.tsx       ← The actual page that triggers loading
    page.tsx         ← Uses component-level Suspense instead
```

## Testing Loading States

To verify loading routes work correctly:

1. **Throttle Network**: Use Chrome DevTools to simulate slow connections
2. **Navigate**: Go to `/tickets/1` and observe the spinner
3. **Verify Replacement**: Confirm the spinner is replaced with actual content
4. **Check Timing**: Loading should appear instantly, not after a delay

## Best Practices

- **Keep It Simple**: Loading UIs should render instantly
- **Preserve Layout**: Avoid layout shifts when content loads
- **Consistent Design**: Use the same loading patterns across your app
- **Accessibility**: Ensure loading states are announced to screen readers
- **Performance**: Don't make loading components too complex

## Error Handling

Loading routes only handle the loading state. For errors during data fetching, use `error.tsx` files alongside your loading routes:

```
src/app/tickets/[ticketId]/
  loading.tsx  ← Handles loading state
  error.tsx    ← Handles error state
  page.tsx     ← The main page
```

This creates a complete fallback system for your route segments.
