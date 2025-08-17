## UI Library: Icons

Use `lucide-react` for consistent, themeable icons. For custom glyphs, use inline SVGs with `currentColor`.

### Lucide React

Install is already configured in `package.json`.

```tsx
import { Plus, Check, File, Pencil } from "lucide-react";

<div className="flex items-center gap-3">
  <Plus />
  <Check className="text-emerald-600" />
  <File className="size-5" />
  <Pencil className="size-5 text-muted-foreground" />
</div>;
```

- Color via Tailwind `text-*` utilities (icons use `currentColor`).
- Size via `size-*` or `w-*/h-*`.

### Inline SVGs

For custom icons or when you want full control, inline SVGs and use `stroke="currentColor"` or `fill="currentColor"`.

```tsx
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-5">
    <path
      d="m4.5 12.75 6 6 9-13.5"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
```

See also:

- `documentation/file base routing/styling-svgs.md` for coloring SVGs with Tailwind
- `documentation/ui-library/ui-library-button.md` for icon usage inside buttons
