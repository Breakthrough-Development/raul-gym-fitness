# Error Routes

Error routes in Next.js App Router provide automatic error handling for route segments. When you create an `error.tsx` file, Next.js automatically wraps that route segment in an Error Boundary and shows your error UI when something goes wrong during rendering or data fetching.

## How Error Routes Work

1. **Automatic Error Boundary**: Next.js wraps the entire route segment with an Error Boundary
2. **Catches Errors**: Captures JavaScript errors anywhere in the route segment tree
3. **Fallback UI**: Shows a custom error UI instead of crashing the app
4. **Client-Side Only**: Error boundaries only work on the client side (must use `"use client"`)

## Implementation

We implemented an error route for individual ticket pages:

```tsx
// src/app/tickets/[ticketId]/error.tsx
"use client";
import Placeholder from "@/components/placeholder";

export default function TicketPageError({ error }: { error: Error }) {
  return <Placeholder label={error.message || "Something went wrong"} />;
}
```

This error component displays when the ticket page encounters an error:

```tsx
// src/app/tickets/[ticketId]/page.tsx - Potential error scenarios
export default async function TicketPage({ params }: TicketPageProps) {
  const ticketId = Number(params.ticketId);
  const ticket = await getTicket(ticketId); // Could throw an error

  if (!ticket) {
    // This is handled gracefully, not an error
    return <Placeholder label="Ticket not found" ... />;
  }

  return <TicketItem ticket={ticket} isDetail />; // Could throw rendering errors
}
```

## Placeholder Component

The error route uses a reusable placeholder component:

```tsx
// src/components/placeholder.tsx
import { LucideMessageSquareWarning } from "lucide-react";

const Placeholder = ({
  label,
  icon = <LucideMessageSquareWarning />,
  button = <div />,
}: PlaceholderProps) => {
  return (
    <section className="flex-1 self-center flex flex-col items-center justify-center gap-y-2">
      {cloneElement(icon, { className: "w-16 h-16" })}
      <h2 className="text-lg text-center">{label}</h2>
      {cloneElement(button, { className: "h-10" })}
    </section>
  );
};
```

## Error Props

Error components receive an `error` prop with these properties:

```tsx
type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void; // Function to retry the operation
};
```

Our implementation uses:

- `error.message`: The error message to display
- Fallback: "Something went wrong" if no message is available

## Error Routes vs Try-Catch

| Error Routes (`error.tsx`) | Try-Catch Blocks           |
| -------------------------- | -------------------------- |
| Route-segment level        | Function level             |
| Catches render errors      | Catches logic errors       |
| Automatic by Next.js       | Manual implementation      |
| Client-side only           | Works anywhere             |
| Shows fallback UI          | Custom error handling      |
| Good for UI errors         | Good for data/logic errors |

## Types of Errors Caught

Error routes catch:

1. **Rendering Errors**: Errors during component rendering
2. **Lifecycle Errors**: Errors in component lifecycle methods
3. **Constructor Errors**: Errors in component constructors
4. **Event Handler Errors**: Errors in event handlers (in some cases)

Error routes **do not** catch:

1. **Server-side errors**: Errors during SSR (use try-catch instead)
2. **Async errors**: Errors in async functions without proper handling
3. **Event handler errors**: Some event handler errors (use try-catch)
4. **Errors in error boundaries**: Errors in the error boundary itself

## When to Use Error Routes

- **Route-level error handling**: When you want to catch all errors in a route
- **Graceful degradation**: When you want to show a fallback instead of crashing
- **User experience**: When you want consistent error handling across pages
- **Production safety**: When you want to prevent white screens of death

## File Structure

```
src/app/
  tickets/
    [ticketId]/
      error.tsx      ← Route-level error boundary for /tickets/[ticketId]
      loading.tsx    ← Loading state for the same route
      page.tsx       ← The actual page that might error
    page.tsx         ← Different route, would need its own error.tsx
```

## Complete Fallback System

Combining loading and error routes creates a robust fallback system:

```
Navigation to /tickets/123
         ↓
   loading.tsx shows     ← Immediate loading state
         ↓
   page.tsx renders      ← Async operations happen
         ↓
    ┌─ Success ─→ Normal page content
    └─ Error ──→ error.tsx shows      ← Error fallback
```

## Error Recovery

You can add a retry mechanism to error routes:

```tsx
export default function TicketPageError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <Placeholder
      label={error.message || "Something went wrong"}
      button={<Button onClick={reset}>Try Again</Button>}
    />
  );
}
```

## Best Practices

1. **Keep It Simple**: Error UIs should be lightweight and always render
2. **Provide Context**: Show meaningful error messages when possible
3. **Offer Recovery**: Include retry buttons or navigation options
4. **Log Errors**: Consider logging errors for debugging (in production)
5. **Graceful Fallbacks**: Don't show technical error details to users
6. **Accessibility**: Ensure error states are accessible to screen readers

## Testing Error Routes

To test error routes:

1. **Throw Errors**: Temporarily throw errors in your components
2. **Network Issues**: Simulate network failures during data fetching
3. **Invalid Data**: Test with malformed or missing data
4. **Browser DevTools**: Use error simulation tools

## Development vs Production

- **Development**: Error routes show detailed error information
- **Production**: Error routes should show user-friendly messages
- **Error Reporting**: Consider integrating with error tracking services

## Nested Error Boundaries

Error routes can be nested for granular error handling:

```
App Level Error Boundary        ← Catches everything
  ↓
Route Level Error Boundary      ← error.tsx files
  ↓
Component Level Error Boundary  ← Custom error boundaries
```

Lower-level boundaries catch errors first, preventing them from bubbling up.
