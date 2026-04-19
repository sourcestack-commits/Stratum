---
paths:
  - "packages/store/**"
---

# Store Rules

- Stores hold CLIENT state only — UI toggles, selections, preferences.
- Never store API response data. That belongs in React Query.
- Always use selectors: `useStore(s => s.field)` not `useStore()`.
- Default values from `@repo/config` constants, never hardcoded.
- All interfaces in `src/types/store.types.ts`.
- Can only import from: `@repo/core`, `@repo/config`, `@repo/types`, `@repo/utils`.
