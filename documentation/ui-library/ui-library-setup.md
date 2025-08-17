https://ui.shadcn.com/docs/installation/next

```
royeradames@royer-adames the-road-to-next-app % npx shadcn@latest init
✔ Preflight checks.
✔ Verifying framework. Found Next.js.
✔ Validating Tailwind CSS config. Found v4.
✔ Validating import alias.
✔ Which color would you like to use as the base color? › Slate
✔ Writing components.json.
✔ Checking registry.
✔ Updating CSS variables in src/app/globals.css
✔ Installing dependencies.
✔ Created 1 file:
  - src/lib/utils.ts

Success! Project initialization completed.
You may now add components.
```

### What this added

- `components.json` with project style and alias configuration
- Dependencies: `class-variance-authority`, `clsx`, `lucide-react`, `tailwind-merge`
- Utility helper: `src/lib/utils.ts` exporting `cn`

### Config snapshot

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

### `cn` utility (merge Tailwind classes safely)

`cn` composes `clsx` and `tailwind-merge` so conditional classes are deduped and conflicts are resolved.

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Usage examples:

```tsx
import { cn } from "@/lib/utils";

<button
  className={cn(
    "px-3 py-1 rounded text-white",
    isPrimary ? "bg-slate-900" : "bg-slate-600",
    disabled && "opacity-50 cursor-not-allowed"
  )}
/>;
```

Why `cn`?

- Resolves conflicts like `p-2` vs `p-4` deterministically
- Keeps the same ergonomic API as `clsx`
- Plays well with component variants (e.g., with `class-variance-authority`)

### Next steps

- Generate UI primitives with `npx shadcn@latest add button card input ...`
- Prefer `cn` over raw `clsx` for class composition
- Use `lucide-react` for icons or inline SVGs where coloring is dynamic
