---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
---

# Testing Rules

- Use Vitest (not Jest). Config at root `vitest.config.ts`.
- Test files next to source: `cn.test.ts` beside `cn.ts`.
- Import from `vitest`: `describe`, `it`, `expect`, `vi`, `beforeEach`.
- Use `vi.fn()` for mocks, `vi.spyOn()` for spies.
- Use `vi.useFakeTimers()` / `vi.useRealTimers()` for time-dependent tests.
- Zustand stores: test via `useStore.getState()` and `useStore.setState()`.
- Reset store state in `beforeEach` to prevent test pollution.
- Name tests descriptively: `it("returns 'just now' for recent dates")`.
