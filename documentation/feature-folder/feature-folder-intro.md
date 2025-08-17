## Feature folder structure

- `app/` contains only routing (layouts, pages) and route-level glue.
- `src/features/*` contains domain code: components, hooks, constants, and types per feature.

### Why

- Keeps route files lean and focused on wiring
- Co-locates domain pieces for discoverability and reuse
- Scales as features grow without bloating `app/`

### Example: `ticket` feature

```
src/
  features/
    ticket/
      components/     # UI specific to tickets
      hooks/          # data fetching or state hooks
      constants.ts    # shared constants
      types.ts        # shared types/interfaces
```

Route files import from `@/features/ticket/*` rather than embedding feature logic.
