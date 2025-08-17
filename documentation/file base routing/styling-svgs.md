## Styling SVGs in Next.js with Tailwind

We use two approaches depending on whether we need dynamic styling:

- Inline SVG in JSX for dynamic color/size
- Static SVGs in `/public` for simple, unstyled images

### 1) Inline SVG (recommended for dynamic color)

Use `fill="currentColor"` or `stroke="currentColor"` inside the SVG and drive color via Tailwind `text-*` utilities. Use `size-*`, `w-*`, `h-*` for sizing.

```tsx
export function CheckIcon({ label = "" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg
        viewBox="0 0 16 16"
        aria-hidden={label ? undefined : true}
        role={label ? "img" : undefined}
        className="size-5 text-emerald-600"
      >
        <path
          d="M2 8l3 3 9-9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      {label ? <span>{label}</span> : null}
    </span>
  );
}
```

- **Color**: set with `text-emerald-600` because the SVG uses `currentColor`.
- **Size**: `size-5` sets both width and height. Use `w-*` and `h-*` if you need different values.
- **Accessibility**: if decorative, keep `aria-hidden`; if informative, set `role="img"` and provide visible text or a `<title>`.

### 2) Static SVG from `/public` (simple, not dynamically colored)

If you don’t need to recolor the SVG at runtime, serve it from `/public` using `next/image` or a plain `img`.

```tsx
import Image from "next/image";

export function BrandMark() {
  return <Image src="/globe.svg" alt="Globe" width={16} height={16} />;
}
```

Notes:

- External SVG files cannot be recolored with CSS from the parent if they contain hard-coded fills (e.g., `fill="#666"`). If you need dynamic color, inline the SVG or preprocess the file to use `currentColor`.
- Size via `width`/`height` props on `<Image>`. Avoid relying on CSS-only sizing for rasterization quality.

### Example of fixed fill in our assets

```1:1:public/globe.svg
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g clip-path="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="#666"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
```

If you want this asset to inherit color from CSS, change hard-coded fills (e.g., `#666`) to `currentColor` and then use Tailwind `text-*` classes when inlining it.

### Advanced: coloring external SVGs with CSS mask

If you must keep the SVG external but need to color it, you can use `mask-image` so the element’s background color becomes the icon color:

```tsx
export function MaskedIcon() {
  return (
    <span
      aria-hidden
      className="inline-block size-5 bg-slate-600 [mask-image:url('/globe.svg')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]"
    />
  );
}
```

Trade-offs: masking loses internal fills/strokes and is best for single-color glyphs.

### Conventions

- Put brand/static SVGs in `public/`.
- Inline frequently-styled icons within components.
- Prefer `currentColor` for themeable icons; set color with Tailwind `text-*`.
- Use `aria-hidden` for decorative icons; otherwise provide accessible text.
