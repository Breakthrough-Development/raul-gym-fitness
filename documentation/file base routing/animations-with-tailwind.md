## Animations and transitions with Tailwind

We use Tailwind transitions widely and can define lightweight keyframe animations for subtle motion.

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
  --animate-fade-from-top: fade-from-top 300ms ease-out both;
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes fade-from-top {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```

Then use it in JSX:

```tsx
<div className="animate-fade-in">Content</div>
```

Real example in our app:

```73:79:src/app/tickets/page.tsx
<ul className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
  {initialTickets.map((ticket) => (
    <li key={ticket.id} className="w-full max-w-[420px] p-4 border border-slate-100 rounded">
      {/* ... */}
    </li>
  ))}
</ul>
```

### Notes

- Keep transitions subtle; prefer `duration-150`–`300` and `ease-in-out`.
- For conditional animation, combine with `clsx` as shown in `conditional-styling.md`.
- Keep animation definitions colocated in `globals.css` under `@theme inline` so they are discoverable.
