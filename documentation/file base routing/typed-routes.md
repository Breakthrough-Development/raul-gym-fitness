## tl;dr

The main benefit is that it can catch edge cases where our constant path links to a page that doesn’t exist, caused by a typo or something else.

## Currently, it doesn’t support TurboPack, causing dev mode to feel noticeably slower.

## Statically typed routes in this project

Next.js can statically type `Link` hrefs to prevent typos and invalid routes. We’ve enabled this and aligned our navigation helpers to keep type safety while staying ergonomic.

### Setup

- Enabled in `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
```

- Next.js generates route types in `.next/types`. TypeScript uses these to validate `Link` `href`s during `next dev` and `next build`.

### How `Link` typing works

- Valid without casts:
  - String literals: `"/tickets"`
  - Template literals with inline variables: `` `/tickets/${id}` ``
- Requires typing/cast:
  - Non-literal strings (e.g., values returned from functions)

Reference: `Route` type from `next`.

```ts
import type { Route } from "next";
```

### Using typed routes with our path utilities

We centralize paths in `src/paths.ts`. To keep type-safety with `Link`, type the return values with `Route<...>`.

```ts
// src/paths.ts
import type { Route } from "next";

export const ticketsPath = (): Route<"/tickets"> => "/tickets";
export const ticketPath = (
  ticketId: string | number
): Route<`/tickets/${string}`> =>
  `/tickets/${ticketId}` as Route<`/tickets/${string}`>;
```

Usage (no casts at call sites):

```tsx
import Link from "next/link";
import { ticketsPath, ticketPath } from "@/paths";

<Link href={ticketsPath()}>Tickets</Link>
<Link href={ticketPath(1)}>View ticket 1</Link>
```

If your helpers return plain `string`, you’ll see an error like: “Type 'string' is not assignable to type 'Route<string>'”. Either type the helpers as above or cast at usage time:

```tsx
import type { Route } from "next";
<Link href={ticketsPath() as Route}>Tickets</Link>;
```

Prefer typing helpers over wide casts.

### Custom components that wrap `Link`

When creating wrapper components that accept `href`, use a generic to preserve the route type:

```tsx
import type { Route } from "next";
import Link from "next/link";

function Card<T extends string>({ href }: { href: Route<T> | URL }) {
  return (
    <Link href={href}>
      <div>My Card</div>
    </Link>
  );
}
```

### Our experience and takeaways

- **Typed routes caught mistakes** early (e.g., misspelled segments) directly in the editor.
- **Helpers need typing**: returning `string` from `paths.ts` breaks `Link` type inference; annotating with `Route<...>` fixes it.
- **Static vs dynamic**: inline template strings keep the strongest guarantees, but typed helpers give us consistency and centralization.
- **Use narrow types when possible**: `Route<"/tickets">` is safer than `Route` or `string`.

### Migration tips

- Start by enabling `typedRoutes` and fixing any literal typos reported by TypeScript.
- Annotate static helpers with exact route literals (e.g., `Route<"/about">`).
- For dynamic segments, annotate with template literal patterns (e.g., `Route<`/tickets/${string}`>`).
- Avoid broad `as Route` casts at call sites; prefer typing the source.

### Troubleshooting

- “Type 'string' is not assignable to type 'Route<...>'”
  - Ensure your helper returns `Route<...>` or cast at usage as a last resort.
- “This expression is not callable” after changing imports
  - Keep helpers as functions (even static ones) to maintain a consistent call site: `ticketsPath()`.
- Routes not recognized
  - Run `next dev` or `next build` once so `.next/types` is generated.

### References

- Next.js docs: Statically Typed Links (`next/link`)
- `next` `Route` type for casting and generics
