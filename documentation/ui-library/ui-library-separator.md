## UI Library: Separator

Accessible visual separator built on Radix UI.

### Import

```tsx
import { Separator } from "@/components/ui/separator";
```

### Usage

```tsx
<div>
  <h3 className="text-lg font-semibold">Section title</h3>
  <Separator />
  <p className="text-sm text-muted-foreground">Content...</p>
</div>
```

### Orientation

```tsx
<div className="flex items-center gap-4">
  <span>Item A</span>
  <Separator orientation="vertical" className="h-6" />
  <span>Item B</span>
  <Separator orientation="vertical" className="h-6" />
  <span>Item C</span>
</div>
```

### API

Props mirror `@radix-ui/react-separator` with Tailwind classes applied via `cn`.

```8:24:src/components/ui/separator.tsx
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}
```

### Example in app

Used on the tickets page:

```74:78:src/app/tickets/page.tsx
<Separator />
<div>
  <ul className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
```

See also: `https://ui.shadcn.com/docs/components/separator`
