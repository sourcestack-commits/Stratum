# Skill: /review

Review code changes against CadVisor monorepo standards.

## When to Use

Run `/review` after writing code, before committing. This checks all changed files against project standards.

## What to Check

### 1. File Size

- No component file exceeds 300 lines
- If exceeded: split into sub-components + composition parent

### 2. Interfaces and Types

- All interfaces must be in `src/types/` folder, not inline in implementation files
- Exception: CVA-coupled props (ButtonProps, StackProps, etc.) stay in component file
- Every type file exports through `src/types/index.ts`

### 3. No Hardcoded Values

- No hardcoded strings for: app names, API URLs, port numbers, storage keys
- No magic numbers for: zoom levels, grid columns, time thresholds, retry counts
- All constants must come from `@repo/config` constants: `APP_DEFAULTS`, `QUERY_CONFIG`, `CAD_CONFIG`, `LAYOUT_CONFIG`, `DASHBOARD_CONFIG`, `TIME_THRESHOLDS`, `LOGGER_CONFIG`

### 4. Architecture Dependencies

Check imports against allowed dependencies:

```
apps       → everything
features   → design-system, store, core, services, error-handling, config, types, utils
design-system → tokens, types, utils
store      → core, config, types, utils
core       → services, observability, config, types, utils
services   → config, types, utils
```

Flag any violation.

### 5. State Management

- Server data uses React Query (`useQuery`, `useMutation`), never stored in Zustand
- Zustand stores use selectors: `useStore(s => s.value)` not `useStore()`
- No duplicating server data into client state

### 6. Error Handling

- Errors imported from `@repo/error-handling`, not from design-system or core
- Error messages use `resolveHttpError()` for user-friendly display, not raw `error.message`
- Features emit errors via `emitGlobalError(error, "context")`

### 7. Component Standards

- Named exports only: `export function Button()` not `export default`
- One component per file
- Event handlers prefixed: `handleClick`, `handleSubmit`
- Boolean props prefixed: `isOpen`, `hasError`
- Early returns for loading/error at top of component

### 8. Dark Mode Colors

- Surface components: `dark:bg-neutral-800` (card, input, modal, toast)
- Never `dark:bg-neutral-950` for surfaces (that's page-level only)
- Borders: `dark:border-neutral-700`
- Text: `dark:text-neutral-50` or `dark:text-white`

### 9. Imports

- Design system components from `@repo/design-system`
- Error handling from `@repo/error-handling`
- Services via `useServices()` from `@repo/services`
- No direct `fetch()` calls in features or UI

## Output Format

For each file reviewed, report:

```
FILE: path/to/file.tsx
  [PASS] or [FAIL] + reason for each check
```

Summary at end: total files, passes, failures, what to fix.
