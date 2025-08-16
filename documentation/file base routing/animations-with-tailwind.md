## Animations and transitions with Tailwind

We currently do not use Tailwind animations in the codebase. This guide shows how to add simple transitions and custom animations if/when needed.

### Transitions

Use Tailwind's transition utilities for common UI interactions:

```tsx
<button className="px-3 py-1 rounded bg-slate-900 text-white transition-colors duration-200 hover:bg-slate-800">
  Hover me
</button>
```

- **transition-\***: which properties to animate (e.g., `transition`, `transition-colors`).
- **duration-\***: how long in ms (e.g., `duration-200`).
- **ease-\***: easing curve (e.g., `ease-in-out`).

### Simple keyframe animations

With Tailwind v4, define custom keyframes in `@theme` and reference with the `animate-[name]` class.

```css
/* src/app/globals.css */
@theme inline {
  /* ...existing theme vars... */
  --animate-fade-in: fade-in 300ms ease-out both;
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}
```

Then use it in JSX:

```tsx
<div className="animate-fade-in">Content</div>
```

### Notes

- Keep transitions subtle; prefer `duration-150`–`300` and `ease-in-out`.
- For conditional animation, combine with `clsx` as shown in `conditional-styling.md`.
- Keep animation definitions colocated in `globals.css` under `@theme inline` so they are discoverable.
