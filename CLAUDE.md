# CLAUDE.md — CadVisor Monorepo

## Project

CadVisor monorepo — pnpm + Turborepo + React 18 + TypeScript strict + Tailwind + shadcn/ui + Zustand + TanStack Query + Tauri.

Three apps: `cadvisor` (web), `cadvisor-admin` (web), `desktop` (Tauri).
Four features: `auth`, `dashboard`, `cad`, `settings`.
Thirteen packages: `types`, `utils`, `config`, `tokens`, `services`, `core`, `store`, `design-system`, `error-handling`, `registry`, `observability`, `mock-api`.

## Commands

```bash
pnpm dev --filter @repo/cadvisor   # Start main app (port 3000)
pnpm dev --filter @repo/cadvisor-admin  # Admin (port 3001)
pnpm storybook                     # Components (port 6006)
pnpm test                          # Run tests
pnpm type-check                    # TypeScript check
pnpm lint                          # ESLint
pnpm format                        # Prettier
pnpm gen:app                       # Create new app
pnpm gen:package                   # Create new package
pnpm gen:feature                   # Create new feature
pnpm gen:component                 # Create new component + story
```

## Architecture Rules

### Layer Dependencies (enforced by ESLint boundaries)

```
apps       → everything
features   → design-system, store, core, services, error-handling, config, types, utils
design-system → tokens, types, utils
store      → core, config, types, utils
core       → services, observability, config, types, utils
services   → config, types, utils
error-handling → types, utils, observability
```

**NEVER**: features → features, services → store, core → features, design-system → store.

### Package Structure

Every package follows this structure:

```
packages/{name}/
  src/
    types/           ← all interfaces and type definitions
      {name}.types.ts
      index.ts
    index.ts         ← public API exports
  package.json
  tsconfig.json
```

## Code Standards

### Component Rules

- **300-line max** per file. Split into sub-components if exceeded.
- **Functional components only**. No class components (except ErrorBoundary).
- **Named exports**: `export function Button()` not `export default`.
- **One component per file**. File name matches component name.
- **Props interface in types/ folder**: not inline in the component file.
- **Early returns** for loading/error states at the top.
- **No nested component definitions**.
- **Event handlers**: `handleClick`, `handleSubmit`.
- **Boolean props**: `isOpen`, `hasError`.

### Component File Order

```
1. Imports
2. Component function
3. Early returns (loading, error)
4. Hooks
5. Derived state
6. Handlers
7. Return JSX
```

### Hook File Order

```
1. Imports
2. Hook function
3. State / queries / mutations
4. Derived values
5. Side effects
6. Handlers
7. Return object
```

### CVA Components (Button, Stack, Grid, Flex, Text, Heading)

These keep their props interface in the same file because it extends `VariantProps<typeof variants>`. All other interfaces go in `types/` folder.

## No Hardcoding

All constants live in `packages/config/src/constants.ts`:

```ts
import {
  APP_DEFAULTS,
  QUERY_CONFIG,
  CAD_CONFIG,
  LAYOUT_CONFIG,
  DASHBOARD_CONFIG,
  TIME_THRESHOLDS,
  LOGGER_CONFIG,
} from "@repo/config";
```

**Never** hardcode: app names, API URLs, port numbers, magic numbers, theme keys, zoom levels, grid columns, time thresholds, sensitive key lists.

## State Management

```
Server data (API responses)  → TanStack React Query
Client data (UI state)       → Zustand stores
NEVER copy server data into Zustand.
```

### Zustand Selectors (mandatory)

```ts
// CORRECT
const theme = useLayoutStore((s) => s.theme);

// WRONG — subscribes to everything
const store = useLayoutStore();
```

## Error Handling

All error handling goes through `@repo/error-handling`. Never import error components from design-system or core.

```ts
import {
  ErrorView,
  ErrorBoundary,
  GlobalErrorProvider,
  NotFoundPage,
  resolveHttpError,
  emitGlobalError,
  NOT_FOUND,
  UNAUTHORIZED,
} from "@repo/error-handling";
```

### Adding Error Codes

Add to `packages/error-handling/src/codes/http-error-codes.ts`. Automatically available everywhere.

### Error in Features

```ts
import { emitGlobalError } from "@repo/error-handling";

onError: (error) => {
  emitGlobalError(error as Error, "feature-name.action");
};
```

### Error Display in UI

```tsx
import { resolveHttpError } from "@repo/error-handling";

{
  error && <Text variant="error">{resolveHttpError(error).message}</Text>;
}
```

## Design System

Components live in `packages/design-system/`. Based on shadcn/ui + Radix UI + Tailwind + CVA.

### Dark Mode Colors (consistent across all components)

```
Page background:   dark:bg-neutral-950
Surface (card, input, modal, toast, dropdown): dark:bg-neutral-800
Borders:           dark:border-neutral-700
Ring offset:       dark:ring-offset-neutral-900
Primary text:      dark:text-neutral-50 or dark:text-white
Muted text:        dark:text-neutral-400
```

**Never** use `dark:bg-neutral-950` for surface components. That's page-level only.

### Imports

```tsx
// UI components
import { Button, Card, Stack, H1, Text, Input, Loader } from "@repo/design-system";

// Theme
import { ThemeProvider, useTheme } from "@repo/design-system";

// Toast
import { Toaster, toast } from "@repo/design-system";
```

## Services

Service interfaces in `packages/services/src/types/`. Two implementations: `platform/web.ts` (fetch) and `platform/tauri.ts` (invoke). Platform chosen automatically by `ServiceProvider`.

```ts
import { useServices } from "@repo/services";

const { auth, cad, dashboard, user } = useServices();
```

## Types

All shared types in `packages/types/`. Each package also has its own `src/types/` folder for package-specific interfaces.

```ts
import type { User, CadProject, CommandMap, EventMap } from "@repo/types";
```

## Mock API (MSW)

Starts automatically in dev mode. Mock data in `packages/mock-api/src/data/`. Handlers in `packages/mock-api/src/handlers/`.

Test credentials: `admin@cadvisor.com` / `admin123`.

## Environment

Each app has `environment/` folder with `.env.demo` and `.env.prod`. Local dev uses `.env.local` (gitignored).

```ts
import { getAppEnv, getApiBaseUrl, isProduction, getAppName } from "@repo/config";
```

## Core (Commands + Events)

```ts
import { executeCommand, registerCommand, emit, on, useEvent } from "@repo/core";

// Typed — TypeScript catches wrong command/event names
executeCommand("panel.open", { type: "dashboard" });
emit("auth.changed", { isAuthenticated: true, user });
```

## Testing

Vitest for unit tests. Tests live next to source files: `cn.test.ts` next to `cn.ts`.

```bash
pnpm test           # run all
pnpm test:watch     # watch mode
pnpm test:coverage  # with coverage
```

## Commits

Conventional commits enforced by commitlint:

```bash
feat: add new feature
fix: fix a bug
refactor: restructure code
docs: update documentation
test: add tests
chore: maintenance
```

## Creating New Things

```bash
pnpm gen:app          # new app with PlatformProvider, routing, env
pnpm gen:package      # new package (basic / react / store)
pnpm gen:feature      # new feature with components, hooks, types
pnpm gen:component    # new design-system component + storybook story
```

After any generator: `pnpm install`.

## File References

```
docs/ARCHITECTURE.md   — full architecture explained simply
docs/FEATURE-LIST.md   — 28 features for stakeholders
docs/DEVELOPER-GUIDE.md — how to create/manage everything
docs/COMMANDS.md       — every command with examples
```
