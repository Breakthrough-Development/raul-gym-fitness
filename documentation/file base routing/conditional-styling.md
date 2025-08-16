## Conditional styling with `clsx` and Tailwind

We use `clsx` to compose Tailwind classes based on runtime conditions. This keeps JSX clean and avoids long ternaries or string concatenation.

### Example in the tickets list

We strike through the ticket content when its status is `DONE`:

```24:30:src/app/tickets/page.tsx
<p
  className={clsx("text-sm text-slate-500 truncate", {
    "line-through": ticket.status === "DONE",
  })}
>
  {ticket.content}
</p>
```

### Core pattern

- Always provide base classes as the first argument.
- Pass an object whose keys are classes and whose values are boolean expressions.

```tsx
className={clsx(
  "text-sm", // base
  {
    "text-green-600": status === "OPEN",
    "text-gray-400 line-through": status === "DONE",
  }
)}
```

### Variations you might use

- Multiple arguments and short-circuit booleans:

```tsx
className={clsx(
  "p-2 rounded",
  isActive && "bg-blue-50",
  isDisabled ? "opacity-50 cursor-not-allowed" : null
)}
```

- Combining responsive/state variants is the same; just use the full Tailwind class string as the key:

```tsx
className={clsx("px-3 py-1", {
  "hover:bg-slate-100 md:bg-slate-50": enableHover,
})}
```

### Prefer `cn` over raw `clsx`

We expose a `cn` helper that wraps `clsx` with `tailwind-merge` to merge and dedupe classes safely. Import from `@/lib/utils`.

```tsx
import { cn } from "@/lib/utils";

<div
  className={cn("p-2", isCompact ? "p-1" : "p-3", disabled && "opacity-50")}
/>;
```

### Notes

- `clsx` is already installed and imported where needed (`import clsx from "clsx"`).
- Prefer `clsx` objects over nested ternaries for readability.
- Return `null`/`undefined` for “no class”; avoid empty strings.
- Compose semantics, not colors: let Tailwind express the visual result.
