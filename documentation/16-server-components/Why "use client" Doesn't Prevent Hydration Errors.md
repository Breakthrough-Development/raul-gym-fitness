## Why "use client" Doesn't Prevent Hydration Errors

Clarifying why hydration mismatches can still happen even when a component uses `"use client"`.

### What is hydration? (Theory)

Next.js renders initial HTML on the server (SSR) and then React hydrates that HTML on the client to make it interactive. Hydration requires the client’s first render output to exactly match the server-rendered HTML.

`"use client"` only ensures the component is bundled and hydrated on the client. It does not skip SSR by default.

### Why mismatches happen

- **Different environments**: Server cannot access `window`, `localStorage`, or user/system preferences. The client can.
- **Non-deterministic rendering**: Server uses defaults; client reads real values at mount.
- **Time-based or random output**: Anything that changes between server and client renders can cause mismatches.

### Example (what we implemented)

We solved a theme-switcher mismatch by gating theme-dependent UI until the component mounted.

```tsx
// src/components/theme/theme-switcher.tsx
"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { LucideMoon, LucideSun } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="cursor-pointer">
        <span className="sr-only">Toggle theme</span>
        <LucideSun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="cursor-pointer"
    >
      <span className="sr-only">
        {theme === "dark" ? "Toggle light mode" : "Toggle dark mode"}
      </span>
      <LucideSun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <LucideMoon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

### Pros and Cons of the mounted-gate pattern

- **Pros**
  - Prevents SSR/CSR mismatch by rendering a stable fallback on both
  - Keeps SSR benefits (SEO, fast first paint)
- **Cons**
  - Brief non-interactive placeholder before mount
  - Must design an SSR-safe fallback

### Folder structure (relevant parts)

```
src/
└── components/
    └── theme/
        ├── theme-provider.tsx
        └── theme-switcher.tsx
```

### Notes

- `"use client"` does not disable SSR. To render only on the client, use dynamic imports with `ssr: false`.
- Alternatively, `suppressHydrationWarning` can silence warnings but does not fix mismatches.
