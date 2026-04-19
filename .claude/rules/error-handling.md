---
paths:
  - "packages/error-handling/**"
---

# Error Handling Rules

- This is the single source of truth for all error handling in the monorepo.
- Error codes in `src/codes/http-error-codes.ts` — add new codes here, they auto-resolve.
- Types in `src/types/error.types.ts`.
- `resolveHttpError()` accepts: status code (number), Error object, or string.
- `ErrorView` renders errors with proper icon, title, status badge, and message.
- `GlobalErrorProvider` wraps apps with ErrorBoundary + toast error listener.
- `emitGlobalError()` is how features report errors.
- Can only import from: `@repo/types`, `@repo/utils`, `@repo/observability`.
