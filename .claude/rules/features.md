---
paths:
  - "packages/features/**"
---

# Feature Package Rules

- Features are isolated. Never import from another feature.
- UI components from `@repo/design-system` only.
- Error handling from `@repo/error-handling` only.
- Server data via React Query (`useQuery`, `useMutation`), never Zustand.
- Emit errors via `emitGlobalError(error, "feature-name.action")`.
- All interfaces in `src/types/` folder.
- Every component under 300 lines.
- Hooks extract logic. Components only render.
- Use constants from `@repo/config`, never hardcode values.
