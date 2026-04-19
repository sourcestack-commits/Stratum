# Skill: /new-feature

Create a new feature module following all CadVisor monorepo standards.

## When to Use

Run `/new-feature [name]` when adding a new domain feature (e.g., billing, notifications, reports).

## Steps

### 1. Generate the Feature

```bash
pnpm gen:feature
# Enter the feature name when prompted
pnpm install
```

### 2. Create Types

Create `packages/features/{name}/src/types/{name}.types.ts` with all interfaces needed:

```ts
import type { ReactNode } from "react";

// Props for the main page
export interface {Name}PageProps {
  // add props
}

// Any feature-specific types
```

Create `packages/features/{name}/src/types/index.ts`:

```ts
export type { {Name}PageProps } from "./{name}.types";
```

### 3. Create Service Interface (if API needed)

Add interface to `packages/services/src/types/service.types.ts`.
Add web implementation to `packages/services/src/platform/web.ts`.
Add tauri implementation to `packages/services/src/platform/tauri.ts`.
Add to `Services` interface and both `createWebServices` / `createTauriServices`.

### 4. Create Mock Data (if API needed)

Add mock data to `packages/mock-api/src/data/{name}.ts`.
Add handlers to `packages/mock-api/src/handlers/{name}.handlers.ts`.
Register in `packages/mock-api/src/browser.ts`.

### 5. Create Store (if client state needed)

Add to `packages/store/src/{name}.store.ts` — client state only.
Add types to `packages/store/src/types/store.types.ts`.
Export from `packages/store/src/index.ts`.

Use constants from `@repo/config` for default values, not hardcoded.

### 6. Create Hooks

Each hook in its own file: `src/hooks/use-{action}.ts`.
Use React Query for data fetching. Use `emitGlobalError` for error handling.

```ts
import { useQuery } from "@tanstack/react-query";
import { useServices } from "@repo/services";

export function use{Name}Data() {
  const { {name} } = useServices();
  return useQuery({
    queryKey: ["{name}", "data"],
    queryFn: () => {name}.getData(),
  });
}
```

### 7. Create Components

Each component under 300 lines. One per file. Named exports.
Import UI from `@repo/design-system`, errors from `@repo/error-handling`.

```tsx
import { Stack, H1, Text, Loader } from "@repo/design-system";
import { ErrorView } from "@repo/error-handling";
import { use{Name}Data } from "../hooks/use-{name}-data";

export function {Name}Page() {
  const { data, isLoading, error, refetch } = use{Name}Data();

  if (isLoading) return <Loader size="lg" />;
  if (error) return <ErrorView error={error} onRetry={() => refetch()} />;

  return (
    <Stack gap="lg" className="p-6">
      <H1>{Name}</H1>
      {/* content */}
    </Stack>
  );
}
```

### 8. Export Public API

`src/index.ts` exports only what other packages need:

```ts
export { {Name}Page } from "./components/{name}-page";
export { use{Name}Data } from "./hooks/use-{name}-data";
export type { {Name}PageProps } from "./types";
```

### 9. Add Route in App

In `apps/cadvisor/src/app/app.tsx`:

```tsx
import { {Name}Page } from "@repo/feature-{name}";

<Route path="/{name}" element={<{Name}Page />} />
```

Add nav button in layout. Add `@repo/feature-{name}` to app's `package.json`.

### 10. Verify

```bash
pnpm type-check
pnpm lint
pnpm test
```

## Checklist

- [ ] Types in `src/types/` folder, not inline
- [ ] No hardcoded values — use `@repo/config` constants
- [ ] Errors from `@repo/error-handling`
- [ ] UI from `@repo/design-system`
- [ ] React Query for server data, not Zustand
- [ ] Zustand selectors used correctly
- [ ] All files under 300 lines
- [ ] Named exports, one component per file
- [ ] Mock API handler added (for dev)
- [ ] Route added in app
