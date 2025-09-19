## Component: Placeholder

Simple centered placeholder for empty or error states with optional icon and action.

### Import

```tsx
import Placeholder from "@/components/placeholder";
```

### Props

- `label` (string, required): Message to display
- `icon` (ReactElement, optional): Icon element; defaults to `LucideMessageSquareWarning`
- `button` (ReactElement, optional): Action element (e.g., a `Button`); defaults to an empty `div`

```4:14:src/components/placeholder.tsx
type PlaceholderProps = {
  label: string;
  icon?: React.ReactElement<{ className?: string }>;
  button?: React.ReactElement<{ className?: string }>;
};

const Placeholder = ({
  label,
  icon = <LucideMessageSquareWarning />,
  button = <div />,
}: PlaceholderProps) => {
```

Icons and buttons are cloned to apply consistent sizing.

```16:23:src/components/placeholder.tsx
{cloneElement(icon, { className: "w-16 h-16" })}
<h2 className="text-lg text-center">{label}</h2>
{cloneElement(button, { className: "h-10" })}
```

### Usage

```tsx
<Placeholder label="Nothing here yet" />

<Placeholder
  label="Not found"
  button={
    <Button asChild variant="outline">
      <Link href="/tickets">Back to tickets</Link>
    </Button>
  }
/>
```

Real usage in the tickets route when a ticket is missing:

```18:26:src/app/tickets/[ticketId]/page.tsx
return (
  <Placeholder
    label="Ticket not found"
    button={
      <Button asChild variant="outline">
        <Link href={ticketsPath() as Route}>Back to tickets</Link>
      </Button>
    }
  />
)
```

### About `React.cloneElement`

We use `cloneElement` to enforce consistent sizing on whatever `icon` and `button` elements are passed in.

- Why: normalize layout without extra wrappers; keep the original element types (SVG, `Button`, `Link`).
- Preserved: all original props and handlers (e.g., `onClick`, `href`).
- Overwritten: `className` is replaced with our sizing (`w-16 h-16` for `icon`, `h-10` for `button`). Any `className` you pass will be ignored in the current implementation.

Advanced (merge instead of overwrite): if you want to preserve consumer classes, change cloning to merge `className` using `cn`.

```tsx
// Inside Placeholder (illustrative alternative)
import { cn } from "@/lib/utils";

{
  cloneElement(icon, { className: cn("w-16 h-16", icon.props.className) });
}
{
  cloneElement(button, { className: cn("h-10", button.props.className) });
}
```

Caveats:

- Only works with valid `ReactElement` children; we type the props accordingly.
- Keys/refs are preserved by React, but we do not forward refs here.
