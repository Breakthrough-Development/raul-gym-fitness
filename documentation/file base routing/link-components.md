### Linking between pages

Use Next.js `Link` instead of the HTML `a` tag for client-side navigation.

- **Why**: prefetching, SPA transitions, accessibility and SEO benefits in Next.js
- **How**: import from `next/link` and pass `href`

```tsx
import Link from "next/link";

<Link href="/tickets">Tickets</Link>;
```

### Our convention: centralize `href`s in `src/paths.ts`

Avoid hardcoded strings in components. Use functions from `src/paths.ts` so routes are refactorable and consistent.

```ts
// src/paths.ts
export const ticketsPath = () => "/tickets";
export const ticketPath = (ticketId: string) => `/tickets/${ticketId}`;
```

```tsx
import Link from "next/link";
import { ticketsPath, ticketPath } from "@/paths";

<Link href={ticketsPath()}>Tickets</Link>
<Link href={ticketPath("1")}>View ticket 1</Link>
```

### Accessibility tip

- When link text is generic (e.g., "View"), include an invisible label for screen readers:

```tsx
<Link href={ticketPath("1")}>
  View <span className="sr-only">ticket 1</span>
</Link>
```

This pattern is used in `src/app/tickets/page.tsx`.
