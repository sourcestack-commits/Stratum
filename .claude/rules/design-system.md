---
paths:
  - "packages/design-system/**"
---

# Design System Rules

- No business logic. Components are pure visual building blocks.
- No data fetching. No store access. No service calls.
- Can only import from: `@repo/tokens`, `@repo/types`, `@repo/utils`.
- Use CVA (`class-variance-authority`) for component variants.
- Use `cn()` from `@repo/utils` for class merging.
- Use `forwardRef` for all DOM-wrapping components.
- Set `displayName` on every forwardRef component.
- Dark mode surface colors: `dark:bg-neutral-800` (never `dark:bg-neutral-950`).
- Dark mode borders: `dark:border-neutral-700`.
- Dark mode text: `dark:text-neutral-50` or `dark:text-white`.
- Every component gets a Storybook story with `autodocs` tag.
- Named exports only. One component per file.
