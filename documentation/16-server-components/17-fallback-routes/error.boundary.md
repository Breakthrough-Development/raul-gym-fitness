# Error Boundaries

Error boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of the component tree that crashed. In Next.js App Router, you can create error boundaries using `error.tsx` files.

## Installation

For custom error boundaries beyond Next.js built-in support:

```bash
npm install react-error-boundary
```

## How Error Boundaries Work

1. **Error Catching**: Catches JavaScript errors during rendering, in lifecycle methods, and in constructors
2. **Fallback UI**: Displays a custom error UI instead of crashing the entire app
3. **Error Isolation**: Prevents errors from bubbling up and crashing the entire application
4. **Client-Side Only**: Error boundaries only work on the client side (require `"use client"`)

## Next.js App Router Implementation

Next.js automatically creates error boundaries when you add `error.tsx` files:

```tsx
// src/app/tickets/[ticketId]/error.tsx
"use client";
import Placeholder from "@/components/placeholder";

export default function TicketPageError({ error }: { error: Error }) {
  return <Placeholder label={error.message || "Something went wrong"} />;
}
```

This automatically wraps the route segment in an error boundary:

```tsx
// Conceptually, Next.js does this automatically:
<ErrorBoundary fallback={<TicketPageError />}>
  <TicketPage />
</ErrorBoundary>
```

## Custom Error Boundary Component

You can also create custom error boundaries for more granular control:

```tsx
// components/error-boundary.tsx
"use client";
import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ComponentType<{ error: Error; reset: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback;
      return <FallbackComponent error={this.state.error} reset={this.reset} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

## Using react-error-boundary Library

For a more feature-rich solution:

```tsx
// Using react-error-boundary
import { ErrorBoundary } from "react-error-boundary";
import Placeholder from "@/components/placeholder";

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <Placeholder
      label={error.message || "Something went wrong"}
      button={<Button onClick={resetErrorBoundary}>Try Again</Button>}
    />
  );
}

// Usage
<ErrorBoundary
  FallbackComponent={ErrorFallback}
  onError={(error, errorInfo) => {
    console.error("Error caught by boundary:", error, errorInfo);
  }}
  onReset={() => {
    // Reset app state if needed
  }}
>
  <SomeComponent />
</ErrorBoundary>;
```

## Error Boundary Props

Error boundary components receive these props:

```tsx
interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}
```

- **error**: The error object that was thrown
- **error.message**: Human-readable error message
- **error.digest**: Next.js error digest (in production)
- **reset**: Function to reset the error boundary and retry

## What Error Boundaries Catch

Error boundaries catch:

✅ **Rendering errors**: Errors during component rendering
✅ **Lifecycle method errors**: Errors in componentDidMount, etc.
✅ **Constructor errors**: Errors in component constructors
✅ **Child component errors**: Errors anywhere in the component tree

Error boundaries **do not** catch:

❌ **Event handler errors**: Errors in onClick, onChange, etc.
❌ **Async errors**: Errors in setTimeout, fetch, etc.
❌ **Server-side rendering errors**: Errors during SSR
❌ **Errors in the error boundary itself**: Self-referential errors

## Error Boundary Strategies

### Route-Level Error Boundaries

```
src/app/
  tickets/
    [ticketId]/
      error.tsx      ← Catches all errors in this route
      page.tsx
    error.tsx        ← Catches all errors in tickets route
    page.tsx
  error.tsx          ← Global error boundary
  layout.tsx
```

### Component-Level Error Boundaries

```tsx
// Wrapping specific components
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <TicketList />
</ErrorBoundary>

<ErrorBoundary FallbackComponent={ErrorFallback}>
  <UserProfile />
</ErrorBoundary>
```

### Nested Error Boundaries

```tsx
// Multiple levels of error handling
<ErrorBoundary FallbackComponent={AppErrorFallback}>
  <App>
    <ErrorBoundary FallbackComponent={PageErrorFallback}>
      <TicketPage>
        <ErrorBoundary FallbackComponent={ComponentErrorFallback}>
          <TicketList />
        </ErrorBoundary>
      </TicketPage>
    </ErrorBoundary>
  </App>
</ErrorBoundary>
```

## Error Recovery Patterns

### Retry Mechanism

```tsx
function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="error-fallback">
      <h2>Something went wrong</h2>
      <pre>{error.message}</pre>
      <Button onClick={resetErrorBoundary}>Try Again</Button>
    </div>
  );
}
```

### Navigation Recovery

```tsx
import { useRouter } from "next/navigation";

function ErrorFallback({ error }: { error: Error }) {
  const router = useRouter();

  return (
    <Placeholder
      label={error.message || "Something went wrong"}
      button={
        <Button onClick={() => router.push("/tickets")}>Back to Tickets</Button>
      }
    />
  );
}
```

### State Reset Recovery

```tsx
function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const handleReset = () => {
    // Clear any error-causing state
    localStorage.removeItem("errorCausingData");
    // Reset the error boundary
    resetErrorBoundary();
  };

  return (
    <div>
      <h2>Something went wrong</h2>
      <Button onClick={handleReset}>Reset and Try Again</Button>
    </div>
  );
}
```

## Error Logging and Monitoring

### Development Logging

```tsx
componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  console.group("🚨 Error Boundary Caught Error");
  console.error("Error:", error);
  console.error("Error Info:", errorInfo);
  console.error("Component Stack:", errorInfo.componentStack);
  console.groupEnd();
}
```

### Production Error Reporting

```tsx
import * as Sentry from "@sentry/nextjs";

componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  Sentry.captureException(error, {
    contexts: {
      react: {
        componentStack: errorInfo.componentStack,
      },
    },
  });
}
```

## Best Practices

1. **Granular Boundaries**: Use multiple error boundaries for different parts of your UI
2. **Graceful Degradation**: Show meaningful fallbacks that help users continue their workflow
3. **Error Recovery**: Always provide a way to recover from errors
4. **Error Reporting**: Log errors for debugging and monitoring
5. **User-Friendly Messages**: Don't show technical error details to users
6. **Accessibility**: Ensure error states are accessible
7. **Testing**: Test error boundaries with intentional errors

## Testing Error Boundaries

### Throwing Test Errors

```tsx
// Component that throws an error for testing
function ErrorTestComponent() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error("Test error for error boundary");
  }

  return <Button onClick={() => setShouldError(true)}>Trigger Error</Button>;
}
```

### Testing with Jest

```tsx
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

const ThrowError = () => {
  throw new Error("Test error");
};

test("error boundary catches and displays error", () => {
  render(
    <ErrorBoundary fallback={({ error }) => <div>{error.message}</div>}>
      <ThrowError />
    </ErrorBoundary>
  );

  expect(screen.getByText("Test error")).toBeInTheDocument();
});
```

## Performance Considerations

- Error boundaries add minimal overhead
- Only wrap components that might error
- Don't wrap every single component
- Consider lazy loading error boundary components
- Cache error boundary instances when possible

## Error Boundary vs Try-Catch

| Error Boundaries      | Try-Catch             |
| --------------------- | --------------------- |
| Declarative           | Imperative            |
| Component tree errors | Function-level errors |
| Render-time errors    | Runtime errors        |
| Automatic fallback UI | Manual error handling |
| React lifecycle aware | General JavaScript    |
| Client-side only      | Works everywhere      |
