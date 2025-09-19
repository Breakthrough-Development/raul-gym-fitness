## UI Library: Theming

This project uses Tailwind v4 with CSS variables and a light/dark theme driven by class toggling.

### Theme tokens

We define design tokens in `:root` and `.dark` using OKLCH colors. Tailwind maps these to utilities via `@theme` custom properties.

```90:126:src/app/globals.css
:root {
  --radius: 0.65rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.141 0.005 285.823);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.795 0.184 86.047);
  --primary-foreground: oklch(0.421 0.095 57.708);
  --secondary: oklch(0.967 0.001 286.375);
  --secondary-foreground: oklch(0.21 0.006 285.885);
  --muted: oklch(0.967 0.001 286.375);
  --muted-foreground: oklch(0.552 0.016 285.938);
  --accent: oklch(0.967 0.001 286.375);
  --accent-foreground: oklch(0.21 0.006 285.885);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.92 0.004 286.32);
  --input: oklch(0.92 0.004 286.32);
  --ring: oklch(0.795 0.184 86.047);
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
  /* ... */
}
```

### Tailwind theme bridge

Under `@theme inline`, Tailwind reads our CSS variables and exposes them as semantic utilities like `bg-background`, `text-foreground`, `border-border`, etc. It also defines shared motion and radii.

```6:21:src/app/globals.css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --animate-fade-from-top: fade-from-top 0.5s ease-out;
  /* ... additional tokens ... */
}
```

### Base layer

We apply the theme using the base layer so all elements inherit sensible defaults.

```162:169:src/app/globals.css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Dark mode

We use a `.dark` class strategy (see `@custom-variant dark`) so any subtree can be themed by toggling the class. You can add `.dark` on `html` or a container.

```4:4:src/app/globals.css
@custom-variant dark (&:is(.dark *));
```

### In practice

- Components reference semantic utilities (`bg-background`, `text-foreground`, `bg-primary`, etc.) and automatically adapt to dark mode.
- Motion tokens like `animate-fade-from-top` power subtle animations used on the tickets list.
- Radii tokens (`--radius-*`) are available for consistent rounding across components.
