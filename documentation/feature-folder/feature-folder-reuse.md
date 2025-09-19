## Reusing feature modules

Features expose reusable UI and domain pieces that routes (and other features) can import directly.

### What to import

- Components (feature UI)
- Types (interfaces/unions)
- Constants (status lists, icon maps)
- Hooks (data/state)

### How routes import

```3:3:src/app/tickets/page.tsx
import TicketItem from "@/features/ticket/components/ticket-item";
```

Feature components reuse local types/constants:

```12:16:src/features/ticket/components/ticket-item.tsx
import type { Ticket } from "../types";
import { TICKET_ICONS } from "../constants";
```

```21:25:src/features/ticket/constants.tsx
export const TICKET_ICONS = {
  OPEN: <LucideFileText />,
  IN_PROGRESS: <LucidePencil />,
  DONE: <LucideCircleCheck />,
};
```

### Optional barrel API

```ts
// src/features/ticket/components/index.ts
export { default as TicketItem } from "./ticket-item";

// src/features/ticket/index.ts
export * from "./types";
export * from "./constants";
export * from "./components";
```

Then:

```tsx
import { TicketItem } from "@/features/ticket";
```

### Guidelines

- Don’t import from `app/` inside features
- Keep domain types in `src/features/<feature>/types.ts`
- Colocate constants/icons with the feature
- Promote truly cross-domain UI to `src/components/`
