# CadVisor Monorepo — Scaffold Design Spec

## Overview

Scaffold a production-grade monorepo for the CadVisor platform: two web apps, one desktop app, four feature modules, and shared platform packages.

## Decisions

| Decision          | Choice                                                |
| ----------------- | ----------------------------------------------------- |
| Apps              | cadvisor (web), cadvisor-admin (web), desktop (Tauri) |
| Features          | auth, dashboard, cad, settings                        |
| Package manager   | pnpm (workspaces)                                     |
| Build tool        | Turborepo                                             |
| Bundler           | Vite                                                  |
| UI framework      | React 18                                              |
| Styling           | Tailwind CSS + CVA                                    |
| Component library | shadcn/ui (Radix UI primitives)                       |
| Client state      | Zustand                                               |
| Server state      | TanStack React Query                                  |
| Desktop           | Tauri v2                                              |
| Testing           | Vitest                                                |
| Linting           | ESLint + eslint-plugin-boundaries                     |
| Language          | TypeScript (strict mode)                              |

## Code Quality Rules

### 300-Line Component Limit (Strict)

No single component file may exceed 300 lines. If a component grows beyond 300 lines, it must be split.

**How to split:**

```
BEFORE (400 lines in one file):
  AIPanel.tsx — renders header, input, response list, settings

AFTER (4 files, each under 150 lines):
  AIPanel.tsx — composes sub-components
  AIPanelHeader.tsx — header section
  AIPanelInput.tsx — input section
  AIPanelResponseList.tsx — response list
```

### React Standards (Mandatory)

1. **Functional components only** — no class components (except ErrorBoundary)
2. **Named exports** — `export function Button()` not `export default`
3. **Custom hooks extract logic** — components render, hooks think
4. **One component per file** — file name matches component name
5. **Props interface at top** — always typed, always named `{ComponentName}Props`
6. **Early returns for loading/error** — guard clauses at top
7. **No nested component definitions** — never define a component inside another component
8. **useCallback/useMemo only when needed** — for memo'd children or expensive computations
9. **Event handlers prefixed with `handle`** — `handleClick`, `handleSubmit`
10. **Boolean props prefixed with `is`/`has`** — `isOpen`, `hasError`

### Component File Structure

Every component file follows this order:

```
1. Imports
2. Props interface
3. Component function
4. Early returns (loading, error)
5. Hooks
6. Derived state
7. Handlers
8. Return JSX
```

### Hook File Structure

```
1. Imports
2. Parameters interface (if needed)
3. Return type interface
4. Hook function
5. State / queries / mutations
6. Derived values
7. Side effects
8. Handlers
9. Return object
```

## Folder Architecture

```
demo-monoreo/
|
|-- apps/
|   |-- cadvisor/                  # Main web app
|   |   |-- src/
|   |   |   |-- app/               # Routes and pages
|   |   |   |-- main.tsx           # Entry point
|   |   |-- index.html
|   |   |-- vite.config.ts
|   |   |-- tailwind.config.ts
|   |   |-- tsconfig.json
|   |   |-- package.json
|   |
|   |-- cadvisor-admin/            # Admin web app
|   |   |-- src/
|   |   |   |-- app/
|   |   |   |-- main.tsx
|   |   |-- index.html
|   |   |-- vite.config.ts
|   |   |-- tailwind.config.ts
|   |   |-- tsconfig.json
|   |   |-- package.json
|   |
|   |-- desktop/                   # Tauri desktop app
|       |-- src/                   # React UI (same as web)
|       |-- src-tauri/             # Rust backend
|       |   |-- src/main.rs
|       |   |-- tauri.conf.json
|       |-- vite.config.ts
|       |-- tailwind.config.ts
|       |-- tsconfig.json
|       |-- package.json
|
|-- packages/
|   |-- types/                     # Shared type definitions
|   |   |-- src/
|   |   |   |-- commands.ts        # CommandMap
|   |   |   |-- events.ts          # EventMap
|   |   |   |-- models/
|   |   |   |   |-- user.ts
|   |   |   |   |-- cad.ts
|   |   |   |   |-- dashboard.ts
|   |   |   |-- index.ts
|   |   |-- tsconfig.json
|   |   |-- package.json
|   |
|   |-- utils/                     # Helper functions
|   |   |-- src/
|   |   |   |-- format-date.ts
|   |   |   |-- generate-id.ts
|   |   |   |-- debounce.ts
|   |   |   |-- cn.ts              # clsx + twMerge (for shadcn)
|   |   |   |-- index.ts
|   |   |-- tsconfig.json
|   |   |-- package.json
|   |
|   |-- config/                    # Env vars, feature flags
|   |   |-- src/
|   |   |   |-- env.ts
|   |   |   |-- feature-flags.ts
|   |   |   |-- platform.ts
|   |   |   |-- index.ts
|   |   |-- tsconfig.json
|   |   |-- package.json
|   |
|   |-- tokens/                    # Design tokens
|   |   |-- src/
|   |   |   |-- colors.ts
|   |   |   |-- spacing.ts
|   |   |   |-- typography.ts
|   |   |   |-- radius.ts
|   |   |   |-- tailwind-preset.ts # Generates Tailwind preset from tokens
|   |   |   |-- index.ts
|   |   |-- tsconfig.json
|   |   |-- package.json
|   |
|   |-- services/                  # API layer
|   |   |-- src/
|   |   |   |-- auth.service.ts
|   |   |   |-- cad.service.ts
|   |   |   |-- dashboard.service.ts
|   |   |   |-- user.service.ts
|   |   |   |-- platform/
|   |   |   |   |-- web.ts         # fetch-based implementations
|   |   |   |   |-- tauri.ts       # invoke-based implementations
|   |   |   |-- context.tsx        # ServiceProvider + useServices hook
|   |   |   |-- index.ts
|   |   |-- tsconfig.json
|   |   |-- package.json
|   |
|   |-- core/                      # Communication system
|   |   |-- src/
|   |   |   |-- commands.ts        # executeCommand, registerCommand
|   |   |   |-- events.ts          # emit, on
|   |   |   |-- query-client.ts    # TanStack Query client setup
|   |   |   |-- hooks/
|   |   |   |   |-- use-event.ts
|   |   |   |-- provider/
|   |   |   |   |-- platform-provider.tsx
|   |   |   |-- index.ts
|   |   |-- tsconfig.json
|   |   |-- package.json
|   |
|   |-- store/                     # Zustand client state
|   |   |-- src/
|   |   |   |-- layout.store.ts    # sidebar, theme, panels
|   |   |   |-- auth.store.ts      # login modal, redirect
|   |   |   |-- cad.store.ts       # selected tool, zoom, active layer
|   |   |   |-- settings.store.ts  # user preferences
|   |   |   |-- index.ts
|   |   |-- tsconfig.json
|   |   |-- package.json
|   |
|   |-- design-system/             # UI layer (shadcn/ui based)
|   |   |-- src/
|   |   |   |-- primitives/
|   |   |   |   |-- box.tsx
|   |   |   |   |-- stack.tsx
|   |   |   |   |-- grid.tsx
|   |   |   |   |-- flex.tsx
|   |   |   |   |-- index.ts
|   |   |   |-- typography/
|   |   |   |   |-- heading.tsx     # H1, H2, H3
|   |   |   |   |-- text.tsx
|   |   |   |   |-- label.tsx
|   |   |   |   |-- code.tsx
|   |   |   |   |-- index.ts
|   |   |   |-- components/        # shadcn/ui components
|   |   |   |   |-- button.tsx
|   |   |   |   |-- card.tsx
|   |   |   |   |-- input.tsx
|   |   |   |   |-- modal.tsx      # (dialog from shadcn)
|   |   |   |   |-- dropdown-menu.tsx
|   |   |   |   |-- toast.tsx
|   |   |   |   |-- loader.tsx
|   |   |   |   |-- error-view.tsx
|   |   |   |   |-- index.ts
|   |   |   |-- theme/
|   |   |   |   |-- theme-provider.tsx
|   |   |   |   |-- index.ts
|   |   |   |-- index.ts
|   |   |-- tsconfig.json
|   |   |-- package.json
|   |
|   |-- features/
|   |   |-- auth/                  # Authentication feature
|   |   |   |-- src/
|   |   |   |   |-- components/
|   |   |   |   |   |-- login-form.tsx
|   |   |   |   |   |-- signup-form.tsx
|   |   |   |   |   |-- auth-guard.tsx
|   |   |   |   |-- hooks/
|   |   |   |   |   |-- use-auth.ts
|   |   |   |   |   |-- use-login.ts
|   |   |   |   |   |-- use-signup.ts
|   |   |   |   |-- index.ts
|   |   |   |-- tsconfig.json
|   |   |   |-- package.json
|   |   |
|   |   |-- dashboard/            # Dashboard feature
|   |   |   |-- src/
|   |   |   |   |-- components/
|   |   |   |   |   |-- dashboard-page.tsx
|   |   |   |   |   |-- stat-card.tsx
|   |   |   |   |   |-- recent-activity.tsx
|   |   |   |   |   |-- quick-actions.tsx
|   |   |   |   |-- hooks/
|   |   |   |   |   |-- use-dashboard-stats.ts
|   |   |   |   |   |-- use-recent-activity.ts
|   |   |   |   |-- index.ts
|   |   |   |-- tsconfig.json
|   |   |   |-- package.json
|   |   |
|   |   |-- cad/                   # CAD feature
|   |   |   |-- src/
|   |   |   |   |-- components/
|   |   |   |   |   |-- cad-canvas.tsx
|   |   |   |   |   |-- cad-toolbar.tsx
|   |   |   |   |   |-- cad-layer-panel.tsx
|   |   |   |   |   |-- cad-properties-panel.tsx
|   |   |   |   |-- hooks/
|   |   |   |   |   |-- use-cad-project.ts
|   |   |   |   |   |-- use-cad-tools.ts
|   |   |   |   |-- index.ts
|   |   |   |-- tsconfig.json
|   |   |   |-- package.json
|   |   |
|   |   |-- settings/             # Settings feature
|   |       |-- src/
|   |       |   |-- components/
|   |       |   |   |-- settings-page.tsx
|   |       |   |   |-- profile-section.tsx
|   |       |   |   |-- appearance-section.tsx
|   |       |   |   |-- notification-section.tsx
|   |       |   |-- hooks/
|   |       |   |   |-- use-settings.ts
|   |       |   |   |-- use-profile.ts
|   |       |   |-- index.ts
|   |       |-- tsconfig.json
|   |       |-- package.json
|   |
|   |-- registry/                  # Dynamic component mapping
|   |   |-- src/
|   |   |   |-- index.ts
|   |   |-- tsconfig.json
|   |   |-- package.json
|   |
|   |-- observability/            # Logging + metrics
|       |-- src/
|       |   |-- logger.ts
|       |   |-- metrics.ts
|       |   |-- index.ts
|       |-- tsconfig.json
|       |-- package.json
|
|-- security/
|   |-- audit.config.js
|   |-- license-policy.js
|
|-- docs/
|   |-- ARCHITECTURE.md
|   |-- FEATURE-LIST.md
|
|-- turbo.json
|-- pnpm-workspace.yaml
|-- package.json
|-- tsconfig.base.json
|-- eslint.config.js
|-- .gitignore
|-- .npmrc
```

## shadcn/ui Integration

shadcn/ui is NOT installed as a dependency. Components are copied into the design-system package and customized.

How it works:

1. shadcn generates components using Radix UI + Tailwind + CVA
2. We place them in `packages/design-system/src/components/`
3. They use our tokens (from `packages/tokens/`) instead of hardcoded values
4. All apps import from `@repo/design-system` — never from shadcn directly

This gives us full control over every component while using shadcn's excellent defaults.

### cn() utility

shadcn requires a `cn()` function (clsx + tailwind-merge). This lives in `packages/utils/src/cn.ts` since it's used everywhere:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Component Size Rules

### 300-Line Max — Enforced

No component file exceeds 300 lines. Split strategy:

| Lines   | Action                                 |
| ------- | -------------------------------------- |
| < 100   | Simple component — good                |
| 100-200 | Medium — fine if well-structured       |
| 200-300 | Getting large — consider splitting     |
| > 300   | MUST split — break into sub-components |

### Split Pattern

```
Component.tsx (< 100 lines)
  — Props, composition, layout
  — Imports sub-components

ComponentHeader.tsx (< 100 lines)
  — Header-specific UI

ComponentBody.tsx (< 150 lines)
  — Main content area

useComponentLogic.ts (< 100 lines)
  — All business logic in a custom hook
```

### React Standards Enforced

- Functional components only
- Named exports (`export function Button`)
- One component per file
- Props typed at top as `{Name}Props`
- Hooks extract logic — components only render
- No nested component definitions
- Event handlers: `handleClick`, `handleSubmit`
- Boolean props: `isOpen`, `hasError`
- Early returns for loading/error states

## Build Phases

### Phase 1: Foundation

- `pnpm init`, `pnpm-workspace.yaml`
- `turbo.json` with build tasks
- `tsconfig.base.json` with strict mode
- `eslint.config.js` with boundary rules
- `.gitignore`, `.npmrc`
- Root `package.json` with workspace scripts

### Phase 2: Leaf Packages

- `packages/types` — CommandMap, EventMap, models
- `packages/utils` — cn(), formatDate, generateId, debounce

### Phase 3: Config + Tokens

- `packages/config` — env, feature flags, platform detection
- `packages/tokens` — colors, spacing, typography, radius, Tailwind preset

### Phase 4: Service Layer

- `packages/services` — service interfaces, web + tauri implementations, ServiceProvider context

### Phase 5: Core System

- `packages/core` — typed commands, typed events, useEvent hook, QueryClient, PlatformProvider

### Phase 6: State Layer

- `packages/store` — layout, auth, cad, settings stores (client state only, selectors)

### Phase 7: Design System

- `packages/design-system` — primitives (Box, Stack, Grid, Flex), typography (H1-H3, Text, Label), shadcn components (Button, Card, Input, Modal, Toast, Loader, ErrorView), ThemeProvider

### Phase 8: Features

- `packages/features/auth` — LoginForm, SignupForm, AuthGuard, useAuth hooks
- `packages/features/dashboard` — DashboardPage, StatCard, hooks
- `packages/features/cad` — CadCanvas, CadToolbar, CadLayerPanel, hooks
- `packages/features/settings` — SettingsPage, ProfileSection, hooks

### Phase 9: Registry + Observability

- `packages/registry` — feature-to-component mapping
- `packages/observability` — structured logger, metrics

### Phase 10: Apps

- `apps/cadvisor` — Vite + React, routes, PlatformProvider wrapper
- `apps/cadvisor-admin` — Vite + React, admin routes
- `apps/desktop` — Tauri shell wrapping same React UI

## Package Dependency Rules

```
apps           → everything
features       → design-system, store, core, services, types, utils, config
design-system  → tokens, types, utils
store          → core, types, utils
core           → services, types, utils, config, observability
services       → types, utils, config
observability  → types, utils, config
registry       → features, design-system, types
tokens         → types
config         → types, utils
utils          → types
types          → (nothing)
```

## Success Criteria

After scaffolding:

1. `pnpm install` — succeeds with no errors
2. `pnpm build` — all packages build in correct order
3. `pnpm dev --filter cadvisor` — web app runs at localhost
4. `pnpm dev --filter cadvisor-admin` — admin app runs at localhost
5. `pnpm lint` — all architecture rules pass
6. `pnpm type-check` — zero TypeScript errors
7. Every component file is under 300 lines
8. shadcn/ui components render with design tokens
9. PlatformProvider wraps all apps
10. Typed commands and events work end-to-end
