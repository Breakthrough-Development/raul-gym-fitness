## UI Library: Button

A reusable button component built with shadcn UI patterns, Tailwind, and `class-variance-authority`.

### Import

```tsx
import { Button } from "@/components/ui/button";
```

### Usage

```tsx
<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Learn more</Button>
```

### Sizes

```tsx
<Button size="sm">Small</Button>
<Button>Default</Button>
<Button size="lg">Large</Button>
<Button size="icon" aria-label="Settings">⚙️</Button>
```

### With icons

Icons inherit sizing via the component’s CSS selectors. To override, add a `size-*` class on the icon.

```tsx
import { Plus } from "lucide-react";

<Button>
  <Plus />
  New
  {/* Defaults to size-4 if no explicit size-* on the icon */}
</Button>

<Button>
  <Plus className="size-5" />
  New
</Button>
```

### As a link (asChild)

Use `asChild` to render the button styles on a different element (e.g., `Link`).

```tsx
import Link from "next/link";

<Button asChild>
  <Link href="/tickets">Go to tickets</Link>
  {/* Renders as <a> with button styles */}
</Button>;
```

### Disabled state

Use the native `disabled` prop. Styles handle pointer events and opacity.

```tsx
<Button disabled>Saving…</Button>
```

### API

Props are based on variants and sizes defined via `cva`.

```7:16:src/components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
```

Variant options: `default | destructive | outline | secondary | ghost | link`

Size options: `sm | default | lg | icon`

### Notes

- Uses `cn` from `@/lib/utils` for class merging
- Built on `@radix-ui/react-slot` for `asChild`
- See shadcn UI docs: `https://ui.shadcn.com/docs/components/button`
