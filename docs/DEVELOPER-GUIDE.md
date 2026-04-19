# Developer Guide — CadVisor Monorepo

This guide is written for a developer who just joined the team. Every section contains exact commands and copy-paste templates. Read from top to bottom on your first day; use the table of contents after that.

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [All Commands — Complete Reference](#2-all-commands--complete-reference)
3. [How to Create a New Package](#3-how-to-create-a-new-package)
4. [How to Create a New Feature](#4-how-to-create-a-new-feature)
5. [How to Create a New App](#5-how-to-create-a-new-app)
6. [How to Add a New Component to the Design System](#6-how-to-add-a-new-component-to-the-design-system)
7. [How to Add a Story to Storybook](#7-how-to-add-a-story-to-storybook)
8. [How to Create a New Store](#8-how-to-create-a-new-store)
9. [How to Add a New Service](#9-how-to-add-a-new-service)
10. [How to Add a New Command or Event](#10-how-to-add-a-new-command-or-event)
11. [Package Dependency Rules](#11-package-dependency-rules)
12. [Component Standards — The 300-Line Rule](#12-component-standards--the-300-line-rule)
13. [Every Package — Purpose and Contents](#13-every-package--purpose-and-contents)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Getting Started

### Prerequisites

| Tool         | Version       | Why                                                 |
| ------------ | ------------- | --------------------------------------------------- |
| Node.js      | 20+           | Runtime for all tooling                             |
| pnpm         | 9.15.0        | Package manager (exact version matters)             |
| Rust + Cargo | latest stable | Required only if working on the `desktop` Tauri app |

Install pnpm if you don't have it:

```bash
npm install -g pnpm@9.15.0
```

Install Rust (desktop app only):

```bash
# macOS / Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Windows
# Download and run: https://rustup.rs
```

### Clone and Install

```bash
git clone <repo-url> demo-monoreo
cd demo-monoreo
pnpm install
```

`pnpm install` does three things automatically (configured in `.npmrc`):

- Installs all workspace packages
- Links `workspace:*` dependencies between packages
- Auto-installs peer dependencies

### First Run

```bash
# Run the main web app in development mode
pnpm dev

# Run only the cadvisor app
pnpm --filter @repo/cadvisor dev

# Open Storybook to browse the design system
pnpm storybook
```

The web app runs at `http://localhost:5173`.
Storybook runs at `http://localhost:6006`.

---

## 2. All Commands — Complete Reference

Run all commands from the **repo root** unless otherwise noted.

### Root-Level Commands

| Command                | What it does                                        |
| ---------------------- | --------------------------------------------------- |
| `pnpm dev`             | Start all apps in dev mode (with Turbo parallelism) |
| `pnpm build`           | Build all packages and apps in dependency order     |
| `pnpm lint`            | Run ESLint across every package                     |
| `pnpm type-check`      | Run `tsc --noEmit` across every package             |
| `pnpm test`            | Run all tests                                       |
| `pnpm clean`           | Delete all `dist/` folders                          |
| `pnpm storybook`       | Start Storybook dev server on port 6006             |
| `pnpm build-storybook` | Build Storybook as a static site                    |
| `pnpm gen:app`         | Run Turborepo generator to scaffold a new app       |

### Filtered Commands — Target a Specific Package

```bash
# Pattern: pnpm --filter <package-name> <script>

pnpm --filter @repo/cadvisor dev
pnpm --filter @repo/cadvisor build
pnpm --filter @repo/design-system type-check
pnpm --filter @repo/feature-auth lint

# Run a command in all feature packages at once
pnpm --filter "./packages/features/**" type-check

# Run a command in all apps at once
pnpm --filter "./apps/**" build
```

### Turborepo Generator

```bash
# Interactive prompt to create a new app
pnpm gen:app
# or equivalently:
pnpm turbo gen workspace
```

### How Turbo Runs Tasks

Turbo reads `turbo.json` to understand task dependencies:

- `build` — runs `^build` first, meaning all upstream packages are built before the current one
- `lint` and `type-check` — same upstream-first order (need compiled types from deps)
- `dev` — no cache, runs persistent (stays alive)
- `clean` — no cache, runs everywhere independently

This means: if you change `@repo/types`, running `pnpm build` will rebuild types first, then everything that depends on it.

---

## 3. How to Create a New Package

Use this when you want to create a shared utility, library, or infrastructure package (not a feature and not an app).

### Step 1 — Decide where it lives

All shared packages go under `packages/`. Features (React UI slices) go under `packages/features/`.

```
packages/
  my-new-package/      <-- your package goes here
    src/
      index.ts
    package.json
    tsconfig.json
```

### Step 2 — Create `package.json`

```json
{
  "name": "@repo/my-new-package",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@repo/types": "workspace:*",
    "@repo/utils": "workspace:*"
  }
}
```

Notes:

- `"main"` and `"types"` point to the TypeScript source directly (no build step needed for in-monorepo usage)
- Always use `workspace:*` for internal packages
- Only add the dependencies you actually need (see the [dependency rules](#11-package-dependency-rules))

### Step 3 — Create `tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

### Step 4 — Create `src/index.ts`

Only export what other packages should use. Keep internals private.

```typescript
// src/index.ts
export { myFunction } from "./my-function";
export type { MyType } from "./my-type";
```

### Step 5 — Add the package as a dependency in another package

Edit the `package.json` of the package that needs it:

```json
{
  "dependencies": {
    "@repo/my-new-package": "workspace:*"
  }
}
```

Then run:

```bash
pnpm install
```

Turbo and pnpm will wire up the symlink automatically.

---

## 4. How to Create a New Feature

A "feature" is a self-contained React slice — it owns its own components, hooks, and public API. Features live under `packages/features/`.

### Folder Structure

```
packages/features/my-feature/
  src/
    components/
      my-feature-page.tsx    <-- the top-level page component
      my-sub-component.tsx
    hooks/
      use-my-feature.ts
    index.ts                 <-- public API: only export what apps need
  package.json
  tsconfig.json
```

### `package.json` Template

```json
{
  "name": "@repo/feature-my-feature",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@repo/design-system": "workspace:*",
    "@repo/store": "workspace:*",
    "@repo/core": "workspace:*",
    "@repo/services": "workspace:*",
    "@repo/config": "workspace:*",
    "@repo/types": "workspace:*",
    "@repo/utils": "workspace:*",
    "@tanstack/react-query": "^5.62.0",
    "react": "^18.3.0"
  }
}
```

Only include the `@repo/*` packages you actually import. The full allowed list for features is: `design-system`, `store`, `core`, `services`, `config`, `types`, `utils`.

### `tsconfig.json` Template

```json
{
  "extends": "../../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

(Three levels up because `packages/features/my-feature/` is three directories deep.)

### Hook Template

```typescript
// src/hooks/use-my-feature.ts
import { useQuery } from "@tanstack/react-query";
import { useServices } from "@repo/services";

export function useMyFeature(id: string) {
  const { myService } = useServices();

  return useQuery({
    queryKey: ["my-feature", id],
    queryFn: () => myService.getItem(id),
  });
}
```

Rules for hooks:

- One hook per file, named `use-<thing>.ts` (kebab-case)
- Export function named `use<Thing>` (PascalCase after `use`)
- Use `useServices()` to access backend data — never call `fetch` directly in a feature
- Use `useQuery` for reads, `useMutation` for writes

### Component Template

```typescript
// src/components/my-feature-page.tsx
import { Card, CardContent, CardHeader, CardTitle, Loader, ErrorView } from "@repo/design-system";
import { useMyFeature } from "../hooks/use-my-feature";

interface MyFeaturePageProps {
  id: string;
}

export function MyFeaturePage({ id }: MyFeaturePageProps) {
  const { data, isLoading, error } = useMyFeature(id);

  if (isLoading) return <Loader size="lg" />;
  if (error) return <ErrorView message={error.message} />;
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* feature content here */}
      </CardContent>
    </Card>
  );
}
```

### `index.ts` — The Public API

Only export what the app or registry actually needs. Never export internal implementation details.

```typescript
// src/index.ts
export { MyFeaturePage } from "./components/my-feature-page";
export { useMyFeature } from "./hooks/use-my-feature";
```

### Register the Feature in the Registry

Edit `packages/registry/src/index.ts` to make the feature accessible by string key:

```typescript
import { lazy, type ComponentType } from "react";

const LazyMyFeature = lazy(() =>
  import("@repo/feature-my-feature").then((m) => ({ default: m.MyFeaturePage as ComponentType })),
);

export const registry: Record<string, ComponentType> = {
  dashboard: LazyDashboard,
  settings: LazySettings,
  "my-feature": LazyMyFeature, // <-- add this
};
```

---

## 5. How to Create a New App

### Method 1 — Turborepo Generator (recommended)

```bash
pnpm gen:app
```

The interactive prompt asks for:

- App name (e.g. `my-app`)
- App type: `web` or `desktop`

The generator creates a scaffold under `apps/my-app/` using templates from `turbo/generators/templates/app/`. Run `pnpm install` after the generator finishes.

### Method 2 — Manual

#### Step 1 — Create the directory structure

```
apps/my-app/
  src/
    app/
      app.tsx
    main.tsx
    globals.css
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  tailwind.config.ts
  postcss.config.js
```

#### Step 2 — `package.json`

```json
{
  "name": "@repo/my-app",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "lint": "eslint .",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@repo/core": "workspace:*",
    "@repo/design-system": "workspace:*",
    "@repo/feature-auth": "workspace:*",
    "@repo/types": "workspace:*",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "vite": "^6.0.0"
  }
}
```

#### Step 3 — `tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### Step 4 — `vite.config.ts`

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

#### Step 5 — `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";
import { tailwindPreset } from "@repo/tokens";

export default {
  presets: [tailwindPreset as Config],
  content: ["./src/**/*.{ts,tsx}", "../../packages/design-system/src/**/*.{ts,tsx}"],
} satisfies Config;
```

#### Step 6 — `src/main.tsx`

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PlatformProvider } from "@repo/core";
import { ThemeProvider } from "@repo/design-system";
import { App } from "./app/app";
import "./globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PlatformProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </PlatformProvider>
  </StrictMode>,
);
```

`PlatformProvider` sets up React Query and the `ServiceProvider`. `ThemeProvider` handles dark/light mode. Always wrap your app in both.

#### Step 7 — Run install

```bash
pnpm install
pnpm --filter @repo/my-app dev
```

---

## 6. How to Add a New Component to the Design System

The design system lives in `packages/design-system/src/`. It has three layers:

| Layer         | Location          | What goes here                                                                         |
| ------------- | ----------------- | -------------------------------------------------------------------------------------- |
| `primitives/` | `src/primitives/` | Layout-only building blocks: `Box`, `Stack`, `Flex`, `Grid`                            |
| `typography/` | `src/typography/` | Text-related: `H1`, `H2`, `H3`, `Text`, `Label`, `Code`                                |
| `components/` | `src/components/` | Interactive and composed UI: `Button`, `Card`, `Input`, `Modal`, `Loader`, `ErrorView` |

### Step 1 — Decide which layer

- Pure layout with no logic or interaction: `primitives/`
- Text display with no interaction: `typography/`
- Anything interactive, stateful, or composed from primitives: `components/`

### Step 2 — Write the component

Follow this template exactly. Use `forwardRef` for anything that wraps a DOM element.

```typescript
// src/components/badge.tsx
import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@repo/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300",
        success:
          "bg-success/10 text-success-dark dark:text-success",
        warning:
          "bg-warning/10 text-warning-dark dark:text-warning",
        error:
          "bg-error/10 text-error-dark dark:text-error",
        outline:
          "border border-neutral-300 text-neutral-700 dark:border-neutral-600 dark:text-neutral-300",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  ),
);
Badge.displayName = "Badge";

export { badgeVariants };
```

Rules:

- Always set `displayName` on `forwardRef` components
- Export both the component and the `Variants` helper so consumers can use the variants in other contexts
- Use tokens from `@repo/tokens` (via Tailwind classes) — no raw hex colors
- Support `className` override on every component

### Step 3 — Add it to the component barrel

Edit `src/components/index.ts`:

```typescript
// Add your export alongside the existing ones
export { Badge, badgeVariants } from "./badge";
```

### Step 4 — Export from the package root

Edit `src/index.ts`:

```typescript
// Add Badge to the existing export line for components
export { ..., Badge, badgeVariants } from "./components";
```

### Step 5 — Add a Storybook story

Create `src/components/badge.stories.tsx` (see [Section 7](#7-how-to-add-a-story-to-storybook) for the full template).

---

## 7. How to Add a Story to Storybook

### File Naming Convention

Stories live next to the component file:

```
src/components/badge.tsx
src/components/badge.stories.tsx   <-- story file
```

Storybook discovers files matching `**/*.stories.@(ts|tsx)` inside `packages/design-system/src/`.

### Story Template

```typescript
// src/components/badge.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";

// Meta configures the story group
const meta: Meta<typeof Badge> = {
  title: "Components/Badge", // path in the Storybook sidebar
  component: Badge,
  tags: ["autodocs"], // auto-generates a docs page
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "error", "outline"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// Each named export = one story
export const Default: Story = {
  args: { children: "Badge" },
};

export const Success: Story = {
  args: { children: "Success", variant: "success" },
};

export const Warning: Story = {
  args: { children: "Warning", variant: "warning" },
};

export const Error: Story = {
  args: { children: "Error", variant: "error" },
};

export const Outline: Story = {
  args: { children: "Outline", variant: "outline" },
};
```

### Adding Controls

Controls let users interact with props in the Storybook UI.

```typescript
argTypes: {
  // Dropdown selector
  variant: {
    control: "select",
    options: ["default", "success"],
  },
  // Toggle
  disabled: { control: "boolean" },
  // Text input
  placeholder: { control: "text" },
  // Number slider
  size: { control: { type: "range", min: 8, max: 48, step: 4 } },
},
```

### Adding a Custom Render Function

Use `render` when you need surrounding context (e.g. to show a label next to an input):

```typescript
export const WithContext: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2 w-48">
      <span className="text-sm text-neutral-600">Status</span>
      <Badge {...args} />
    </div>
  ),
  args: { children: "Active", variant: "success" },
};
```

### Storybook Commands

| Command                | What it does                                  |
| ---------------------- | --------------------------------------------- |
| `pnpm storybook`       | Start dev server on port 6006                 |
| `pnpm build-storybook` | Build static Storybook to `storybook-static/` |

---

## 8. How to Create a New Store

Stores hold **client-only UI state** — things like whether a sidebar is open, the currently selected tool, or user preferences that don't need to survive a page refresh. Stores are **not** for server data; use React Query for that.

### Where to Put It

All stores live in `packages/store/src/`. Name the file `<domain>.store.ts`.

```
packages/store/src/
  my-feature.store.ts   <-- your new store
  index.ts              <-- re-export it here
```

### Store Template with Zustand

```typescript
// packages/store/src/my-feature.store.ts
import { create } from "zustand";

// 1. Define the state shape and actions in one interface
interface MyFeatureState {
  // --- state ---
  selectedItemId: string | null;
  isPanelOpen: boolean;

  // --- actions ---
  selectItem: (id: string | null) => void;
  togglePanel: () => void;
  setPanelOpen: (open: boolean) => void;
}

// 2. Create the store
export const useMyFeatureStore = create<MyFeatureState>((set) => ({
  // initial state
  selectedItemId: null,
  isPanelOpen: false,

  // actions — always use `set`, never mutate directly
  selectItem: (id) => set({ selectedItemId: id }),
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  setPanelOpen: (open) => set({ isPanelOpen: open }),
}));
```

### Exporting from the Store Package

Add your store to `packages/store/src/index.ts`:

```typescript
export { useMyFeatureStore } from "./my-feature.store";
```

### Using the Store in a Component (with Selectors)

Always select only the slice you need. This prevents unnecessary re-renders.

```typescript
import { useMyFeatureStore } from "@repo/store";

// Good — subscribe only to what this component uses
function MyPanel() {
  const isPanelOpen = useMyFeatureStore((s) => s.isPanelOpen);
  const togglePanel = useMyFeatureStore((s) => s.togglePanel);

  return (
    <button onClick={togglePanel}>
      {isPanelOpen ? "Close" : "Open"}
    </button>
  );
}

// Avoid — subscribes to the whole state, re-renders on any change
function BadExample() {
  const store = useMyFeatureStore(); // don't do this
  return <div>{store.isPanelOpen}</div>;
}
```

### Store Rules

1. Stores hold UI state only — never cache server responses (use React Query for that)
2. One domain per file — `layout.store.ts`, `cad.store.ts`, not a single giant store
3. Actions live inside the store definition — no external mutation
4. Keep stores flat — avoid deeply nested objects

---

## 9. How to Add a New Service

Services abstract backend access. Every service has:

1. An **interface** (the contract) in `packages/services/src/`
2. A **web implementation** that calls your REST API
3. A **Tauri implementation** that calls Rust via `invoke()`
4. Registration in `context.tsx` so `useServices()` returns it

### Step 1 — Define the Interface

Create `packages/services/src/notifications.service.ts`:

```typescript
// packages/services/src/notifications.service.ts
import type { Notification } from "@repo/types";

export interface NotificationsService {
  list(): Promise<Notification[]>;
  markRead(id: string): Promise<void>;
  dismiss(id: string): Promise<void>;
}
```

### Step 2 — Web Implementation

Add to `packages/services/src/platform/web.ts`:

```typescript
export const webNotificationsService: NotificationsService = {
  list: () => fetchJson(apiUrl("/notifications")),
  markRead: (id) => fetchJson(apiUrl(`/notifications/${id}/read`), { method: "POST" }),
  dismiss: (id) => fetchJson(apiUrl(`/notifications/${id}`), { method: "DELETE" }),
};
```

### Step 3 — Tauri Implementation

Add to `packages/services/src/platform/tauri.ts`:

```typescript
export const tauriNotificationsService: NotificationsService = {
  list: () => invoke("notifications_list"),
  markRead: (id) => invoke("notifications_mark_read", { id }),
  dismiss: (id) => invoke("notifications_dismiss", { id }),
};
```

### Step 4 — Register in `context.tsx`

Edit `packages/services/src/context.tsx`:

```typescript
// 1. Import the new interface and implementations
import type { NotificationsService } from "./notifications.service";
import { webNotificationsService, ... } from "./platform/web";
import { tauriNotificationsService, ... } from "./platform/tauri";

// 2. Add to the Services interface
export interface Services {
  auth: AuthService;
  cad: CadService;
  dashboard: DashboardService;
  user: UserService;
  notifications: NotificationsService;  // <-- add this
}

// 3. Add to createServices()
function createServices(): Services {
  const platform = detectPlatform();
  if (platform === "tauri") {
    return {
      ...existing,
      notifications: tauriNotificationsService,  // <-- add
    };
  }
  return {
    ...existing,
    notifications: webNotificationsService,  // <-- add
  };
}
```

### Step 5 — Export the Interface

Add to `packages/services/src/index.ts`:

```typescript
export type { NotificationsService } from "./notifications.service";
```

### Step 6 — Use in a Feature

```typescript
// In any feature hook
import { useQuery } from "@tanstack/react-query";
import { useServices } from "@repo/services";

export function useNotifications() {
  const { notifications } = useServices();
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => notifications.list(),
  });
}
```

---

## 10. How to Add a New Command or Event

Commands are actions that can be dispatched from anywhere and handled by a registered handler. Events are notifications that something happened, with zero or more listeners. Both are fully typed via `CommandMap` and `EventMap` in `@repo/types`.

### Step 1 — Add to CommandMap or EventMap

Edit `packages/types/src/commands.ts` to add a command:

```typescript
export type CommandMap = {
  // existing entries...
  "auth.login": { email: string; password: string };

  // add your new command:
  "notifications.mark-all-read": void;
  "notifications.dismiss": { id: string };
};
```

Edit `packages/types/src/events.ts` to add an event:

```typescript
export type EventMap = {
  // existing entries...
  "auth.changed": { isAuthenticated: boolean; user: User | null };

  // add your new event:
  "notifications.updated": { unreadCount: number };
};
```

If the payload is `void`, the command/event takes no argument. If it has a shape, define the properties inline.

### Step 2 — Register a Command Handler

Handlers are typically registered in a feature's initialisation or in `main.tsx`. Register early, before any dispatch can happen.

```typescript
import { registerCommand } from "@repo/core";

// No-payload command
registerCommand("notifications.mark-all-read", async () => {
  await notificationsService.markAllRead();
  emit("notifications.updated", { unreadCount: 0 });
});

// With-payload command
registerCommand("notifications.dismiss", async ({ id }) => {
  await notificationsService.dismiss(id);
});
```

### Step 3 — Execute a Command

```typescript
import { executeCommand } from "@repo/core";

// No-payload command
executeCommand("notifications.mark-all-read");

// With-payload command
executeCommand("notifications.dismiss", { id: "notif-123" });
```

### Step 4 — Emit an Event

```typescript
import { emit } from "@repo/core";

// Emit a void event
emit("auth.session-expired");

// Emit an event with data
emit("notifications.updated", { unreadCount: 5 });
```

### Step 5 — Listen with `useEvent`

`useEvent` is the React hook for subscribing to events. It automatically unsubscribes when the component unmounts.

```typescript
import { useEvent } from "@repo/core";
import { useCallback } from "react";

function NotificationBadge() {
  const handleUpdate = useCallback((data: { unreadCount: number }) => {
    // react to the event, e.g. update local state
    console.log("Unread:", data.unreadCount);
  }, []);

  useEvent("notifications.updated", handleUpdate);

  return <span>{/* badge UI */}</span>;
}
```

Important: wrap the handler in `useCallback` to avoid the `useEffect` re-subscribing on every render.

---

## 11. Package Dependency Rules

The monorepo uses `eslint-plugin-boundaries` to enforce these rules. Violations cause a lint error — CI will block your PR.

### The Full Dependency Matrix

| From \ Can import | types | utils | config | tokens | observability | services | store | core | design-system | features | registry | apps |
| ----------------- | ----- | ----- | ------ | ------ | ------------- | -------- | ----- | ---- | ------------- | -------- | -------- | ---- |
| **types**         | -     | no    | no     | no     | no            | no       | no    | no   | no            | no       | no       | no   |
| **utils**         | yes   | -     | no     | no     | no            | no       | no    | no   | no            | no       | no       | no   |
| **config**        | yes   | yes   | -      | no     | no            | no       | no    | no   | no            | no       | no       | no   |
| **tokens**        | yes   | no    | no     | -      | no            | no       | no    | no   | no            | no       | no       | no   |
| **observability** | yes   | yes   | yes    | no     | -             | no       | no    | no   | no            | no       | no       | no   |
| **services**      | yes   | yes   | yes    | no     | no            | -        | no    | no   | no            | no       | no       | no   |
| **store**         | yes   | yes   | no     | no     | no            | no       | -     | yes  | no            | no       | no       | no   |
| **core**          | yes   | yes   | yes    | no     | yes           | yes      | no    | -    | no            | no       | no       | no   |
| **design-system** | yes   | yes   | no     | yes    | no            | no       | no    | no   | -             | no       | no       | no   |
| **features**      | yes   | yes   | yes    | no     | no            | yes      | yes   | yes  | yes           | no\*     | no       | no   |
| **registry**      | yes   | no    | no     | no     | no            | no       | no    | no   | yes           | yes      | -        | no   |
| **apps**          | yes   | yes   | yes    | yes    | yes           | yes      | yes   | yes  | yes           | yes      | yes      | -    |

\*Features cannot import other features. Each feature is isolated.

### How to Add a Dependency

1. Add to `package.json` using `workspace:*`
2. Run `pnpm install`
3. Check that the import is allowed by the matrix above
4. Run `pnpm lint` to confirm no boundary violations

### What Happens if You Violate the Rules

You get a lint error like:

```
error  [boundaries/element-types] Importing from features is not allowed in design-system
```

The fix is always one of:

- Move the import to a layer that is allowed to use it
- Invert the dependency (pass data as props instead of importing)
- Move the shared code to a lower-level package like `types` or `utils`

---

## 12. Component Standards — The 300-Line Rule

No component file should exceed 300 lines. If it does, split it.

### How to Split

When a component is getting too large:

1. Extract sub-components into separate files in the same folder
2. Extract business logic into a `use-<name>.ts` hook
3. Extract data fetching into its own hook

```
# Before (too large)
src/components/
  dashboard-page.tsx   <-- 400 lines, too big

# After (split correctly)
src/components/
  dashboard-page.tsx       <-- orchestrator, ~60 lines
  stat-card.tsx            <-- focused sub-component
  recent-activity.tsx      <-- focused sub-component
  quick-actions.tsx        <-- focused sub-component
src/hooks/
  use-dashboard-stats.ts   <-- data fetching
  use-recent-activity.ts   <-- data fetching
```

### File Structure Template

```
packages/features/my-feature/
  src/
    components/
      my-feature-page.tsx   <-- orchestrator only, imports sub-components
      section-a.tsx         <-- focused, <= 300 lines
      section-b.tsx
    hooks/
      use-my-feature-data.ts    <-- data fetching with React Query
      use-my-feature-actions.ts <-- mutations and commands
    index.ts
```

### Hook Structure Template

```typescript
// hooks/use-my-feature-actions.ts

// 1. Imports at the top
import { useMutation } from "@tanstack/react-query";
import { useServices } from "@repo/services";
import { emit } from "@repo/core";
import type { MyType } from "@repo/types";

// 2. Hook function — one clear responsibility
export function useMyFeatureActions() {
  const { myService } = useServices();

  const createItem = useMutation({
    mutationFn: (data: MyType) => myService.create(data),
    onSuccess: (item) => {
      emit("my-feature.created", { id: item.id });
    },
    onError: (error) => {
      emit("error", { error: error as Error, context: "my-feature.create" });
    },
  });

  return { createItem };
}
```

### Naming Conventions

| Thing               | Convention                | Example                  |
| ------------------- | ------------------------- | ------------------------ |
| Component files     | kebab-case                | `stat-card.tsx`          |
| Hook files          | `use-` prefix, kebab-case | `use-dashboard-stats.ts` |
| Component functions | PascalCase                | `StatCard`               |
| Hook functions      | `use` prefix, PascalCase  | `useDashboardStats`      |
| Store files         | `<domain>.store.ts`       | `cad.store.ts`           |
| Store exports       | `use<Domain>Store`        | `useCadStore`            |
| Service files       | `<domain>.service.ts`     | `auth.service.ts`        |
| Type files          | kebab-case                | `cad.ts`, `user.ts`      |
| Package names       | `@repo/<name>`            | `@repo/feature-auth`     |

---

## 13. Every Package — Purpose and Contents

### `@repo/types`

**What it does:** Central TypeScript type definitions for the whole system.

**Contents:**

- `commands.ts` — `CommandMap`: typed map of every command name to its payload
- `events.ts` — `EventMap`: typed map of every event name to its payload
- `models/user.ts` — `User`, `LoginCredentials`, `SignupCredentials`, `AuthSession`
- `models/cad.ts` — `CadProject`, `CadLayer`, `CadElement`, `CadTool`
- `models/dashboard.ts` — `DashboardStats`, `ActivityItem`

**Who uses it:** Every other package. It is the bottom of the dependency tree and imports nothing.

**Example:**

```typescript
import type { User, CadProject, CommandMap } from "@repo/types";
```

---

### `@repo/utils`

**What it does:** Pure utility functions with no framework dependencies.

**Contents:**

- `cn.ts` — `cn()`: merges Tailwind class names using `clsx` + `tailwind-merge`
- `debounce.ts` — `debounce()`: debounces a function call
- `format-date.ts` — `formatDate()`, `formatRelativeTime()`
- `generate-id.ts` — `generateId()`: generates a unique string id

**Who uses it:** Any package that needs class merging or date formatting.

**Example:**

```typescript
import { cn, formatRelativeTime, generateId } from "@repo/utils";

const classes = cn("text-sm text-neutral-600", isActive && "text-primary-600");
const timeAgo = formatRelativeTime("2024-01-01T00:00:00Z"); // "3d ago"
const id = generateId(); // "ck9x2j..."
```

---

### `@repo/config`

**What it does:** Runtime configuration, environment variable access, and feature flags.

**Contents:**

- `env.ts` — `getEnv(key, fallback)`, `getApiBaseUrl()`
- `platform.ts` — `detectPlatform()`, `isTauri()`, `isWeb()`
- `feature-flags.ts` — `getFeatureFlags()`, `isFeatureEnabled(flag)`

**Who uses it:** `services`, `core`, `observability`, features, and apps.

**Example:**

```typescript
import { isTauri, getApiBaseUrl, isFeatureEnabled } from "@repo/config";

if (isTauri()) {
  // use Tauri-specific behaviour
}

if (isFeatureEnabled("enableBilling")) {
  // show billing UI
}
```

---

### `@repo/tokens`

**What it does:** Design tokens — the single source of truth for all colors, spacing, typography, and border radii.

**Contents:**

- `colors.ts` — `primary`, `neutral`, `success`, `warning`, `error` palettes
- `spacing.ts` — spacing scale
- `typography.ts` — font families and font size scale
- `radius.ts` — border radius values
- `tailwind-preset.ts` — `tailwindPreset`: a Tailwind config preset that injects all tokens

**Who uses it:** `design-system` (via Tailwind classes) and apps (in `tailwind.config.ts`).

**Example:**

```typescript
// tailwind.config.ts in any app
import { tailwindPreset } from "@repo/tokens";

export default {
  presets: [tailwindPreset],
  content: ["./src/**/*.{ts,tsx}"],
};
```

---

### `@repo/services`

**What it does:** Defines service interfaces and provides platform-specific implementations (web vs Tauri).

**Contents:**

- `auth.service.ts` — `AuthService` interface
- `cad.service.ts` — `CadService` interface
- `dashboard.service.ts` — `DashboardService` interface
- `user.service.ts` — `UserService` interface
- `platform/web.ts` — REST API implementations using `fetch`
- `platform/tauri.ts` — Desktop implementations using Tauri `invoke()`
- `context.tsx` — `ServiceProvider`, `useServices()`, `Services` interface

**Who uses it:** `core` (wraps it in `PlatformProvider`) and features (via `useServices()`).

**Example:**

```typescript
import { useServices } from "@repo/services";

function MyHook() {
  const { auth, cad, dashboard, user } = useServices();
  // use auth.login(), cad.listProjects(), etc.
}
```

---

### `@repo/core`

**What it does:** Provides the cross-cutting runtime infrastructure — the command bus, the event bus, React Query client, and the root provider.

**Contents:**

- `commands.ts` — `registerCommand()`, `executeCommand()`
- `events.ts` — `emit()`, `on()`
- `hooks/use-event.ts` — `useEvent()` React hook
- `query-client.ts` — shared `QueryClient` with 5-minute stale time
- `provider/platform-provider.tsx` — `PlatformProvider` (wraps QueryClient + ServiceProvider)

**Who uses it:** Apps (wrap the app in `PlatformProvider`) and features (dispatch commands, emit events, subscribe with `useEvent`).

**Example:**

```typescript
import { registerCommand, executeCommand, emit, useEvent } from "@repo/core";

// Register a handler once, e.g. in main.tsx
registerCommand("theme.toggle", () => {
  emit("notification", { message: "Theme toggled", type: "info" });
});

// Execute from any component
executeCommand("theme.toggle");
```

---

### `@repo/store`

**What it does:** Client-side UI state management using Zustand.

**Contents:**

- `layout.store.ts` — `useLayoutStore`: sidebar visibility, theme, active panels
- `auth.store.ts` — `useAuthStore`: login modal open/close state
- `cad.store.ts` — `useCadStore`: selected tool, zoom level, active layer
- `settings.store.ts` — `useSettingsStore`: language, notifications, auto-save

**Who uses it:** Features and apps.

**Example:**

```typescript
import { useLayoutStore, useCadStore } from "@repo/store";

// Subscribe to a specific slice
const sidebarOpen = useLayoutStore((s) => s.sidebarOpen);
const toggleSidebar = useLayoutStore((s) => s.toggleSidebar);

const selectedTool = useCadStore((s) => s.selectedTool);
```

---

### `@repo/design-system`

**What it does:** The shared component library. All UI in every app and feature is built from these components.

**Contents — Primitives:**

- `Box` — a generic `div` with layout utilities
- `Stack` — vertical flex column with configurable `gap` and `align`
- `Flex` — horizontal/vertical flex container with full axis control
- `Grid` — CSS grid container

**Contents — Typography:**

- `H1`, `H2`, `H3` — heading components
- `Text` — body text with `variant` (`default`, `muted`, `error`) and `size`
- `Label` — form label
- `Code` — inline code

**Contents — Components:**

- `Button` — variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`; sizes: `default`, `sm`, `lg`, `icon`
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- `Input` — styled HTML input
- `Modal`, `ModalTrigger`, `ModalClose`, `ModalOverlay`, `ModalContent`, `ModalHeader`, `ModalTitle`
- `Loader` — spinner with `sm`, `md`, `lg` sizes
- `ErrorView` — error state with optional retry button

**Contents — Theme:**

- `ThemeProvider` — wraps the app, applies `dark` class based on system/user preference
- `useTheme()` — returns `{ theme, setTheme }`

**Who uses it:** All features and apps.

**Example:**

```typescript
import { Stack, Card, CardContent, Button, Loader, ErrorView } from "@repo/design-system";

function MyView() {
  return (
    <Stack gap="md">
      <Card>
        <CardContent>
          <Button variant="outline" size="sm">Click me</Button>
        </CardContent>
      </Card>
    </Stack>
  );
}
```

---

### `@repo/feature-auth`

**What it does:** Authentication UI — login, signup, and route guard.

**Contents:**

- `LoginForm` — email + password form, calls `useLogin()` mutation
- `SignupForm` — name + email + password form
- `AuthGuard` — wraps children, shows `LoginForm` if not authenticated
- `useAuth()` — returns `{ user, isAuthenticated, isLoading }`
- `useLogin()` — `useMutation` for login, emits `auth.changed` on success
- `useSignup()` — `useMutation` for signup

**Who uses it:** Apps (`App` wraps its content in `AuthGuard`).

**Example:**

```typescript
import { AuthGuard, useAuth } from "@repo/feature-auth";

// Protect a page
<AuthGuard><Dashboard /></AuthGuard>

// Read auth state in any component
const { user, isAuthenticated } = useAuth();
```

---

### `@repo/feature-dashboard`

**What it does:** The main dashboard view showing stats and recent activity.

**Contents:**

- `DashboardPage` — orchestrator component
- `StatCard` — a single metric card
- `RecentActivity` — activity feed
- `QuickActions` — shortcut buttons
- `useDashboardStats()` — React Query hook for stats
- `useRecentActivity()` — React Query hook for activity

**Who uses it:** The main `cadvisor` app and the registry.

---

### `@repo/feature-cad`

**What it does:** The CAD editor feature — canvas, toolbar, layers, and properties panels.

**Contents:**

- `CadCanvas` — main drawing surface
- `CadToolbar` — tool selection bar
- `CadLayerPanel` — layer list panel
- `CadPropertiesPanel` — selected element properties
- `useCadProjects()` — list all projects
- `useCadProject(id)` — get single project
- `useCadTools()` — selected tool state + `handleSelectTool`, `handleZoom`

**Who uses it:** The `cadvisor` app.

---

### `@repo/feature-settings`

**What it does:** User settings screens — profile, appearance, and notification preferences.

**Contents:**

- `SettingsPage` — orchestrator
- `ProfileSection` — edit name and avatar
- `AppearanceSection` — light/dark/system theme toggle
- `NotificationSection` — notification on/off toggles
- `useSettings()` — reads and writes from `useSettingsStore`
- `useProfile()` — reads/updates user profile via `UserService`

**Who uses it:** The `cadvisor` app and the registry.

---

### `@repo/registry`

**What it does:** A lazily-loaded map from string keys to page-level React components. Apps use it to render pages dynamically without importing every feature directly.

**Contents:**

- `registry` — `Record<string, ComponentType>` with lazy-loaded feature pages
- `getComponent(type)` — looks up a component by key

**Who uses it:** Apps that do dynamic routing or panel rendering.

**Example:**

```typescript
import { getComponent } from "@repo/registry";
import { Suspense } from "react";

function DynamicPage({ route }: { route: string }) {
  const Component = getComponent(route);
  if (!Component) return <div>Not found</div>;
  return <Suspense fallback={<Loader />}><Component /></Suspense>;
}
```

---

### `@repo/observability`

**What it does:** Structured logging and in-memory metrics. Redacts sensitive fields (password, token, secret) automatically.

**Contents:**

- `logger` — `logger.debug(msg, data?)`, `.info()`, `.warn()`, `.error()`
- `metrics` — `metrics.increment(name)`, `.get(name)`, `.getAll()`

**Who uses it:** Any package that needs logging. Features typically call `logger.error()` in mutation `onError` callbacks.

**Example:**

```typescript
import { logger, metrics } from "@repo/observability";

logger.info("User logged in", { userId: user.id });
logger.error("Failed to load project", { error, projectId });

metrics.increment("cad.project.saved");
console.log(metrics.getAll()); // { "cad.project.saved": 3 }
```

---

## 14. Troubleshooting

### "Module not found: @repo/some-package"

You are importing a workspace package that is not yet installed.

**Fix:**

```bash
pnpm install
```

If that doesn't fix it, check that the package's `package.json` has `"main": "./src/index.ts"` pointing to a file that actually exists.

---

### "Type error in package X when I changed package Y"

Packages reference each other's TypeScript source directly. If you change an interface in `@repo/types`, packages that depend on it may show stale type errors.

**Fix:** Rebuild the changed package first:

```bash
pnpm --filter @repo/types build
# or rebuild everything
pnpm build
```

In development, the editor picks up changes via the shared `src/index.ts` entry point, so you usually don't need to rebuild during normal dev work.

---

### "Cannot find module" after adding a new `workspace:*` dependency

You added a new `@repo/*` dependency to a `package.json` but didn't run install.

**Fix:**

```bash
pnpm install
```

---

### "ESLint: Importing from X is not allowed in Y"

You violated a package boundary rule. See [Section 11](#11-package-dependency-rules) for what is allowed.

**Fix:** Restructure your import:

- Move shared logic down to `types`, `utils`, or `config`
- Pass data as props instead of importing from a sibling
- Check the matrix — maybe the import should go the other direction

---

### "pnpm: command not found" or wrong pnpm version

The repo requires pnpm 9.15.0 exactly (set in `package.json` as `"packageManager": "pnpm@9.15.0"`).

**Fix:**

```bash
npm install -g pnpm@9.15.0
# then verify
pnpm --version  # should print 9.15.0
```

---

### TypeScript strict errors: "possibly undefined", "unused variable"

The root `tsconfig.base.json` enables all strict checks including `noUncheckedIndexedAccess` and `noUnusedLocals`. These are intentional.

Common patterns:

```typescript
// noUncheckedIndexedAccess: array access returns T | undefined
const items: string[] = [];
const first = items[0]; // type is string | undefined
const safe = items[0] ?? "default"; // handle it

// noUnusedLocals: prefix unused variables with _
function handler(_event: MouseEvent) {
  // ...
}
```

---

### Clearing Everything and Starting Fresh

When things are really broken (corrupted node_modules, phantom type errors, mismatched lockfile):

```bash
# From the repo root
pnpm clean           # deletes all dist/ folders
rm -rf node_modules  # remove root node_modules
# then for each package with its own node_modules:
find . -name "node_modules" -type d -prune -exec rm -rf {} +
pnpm install         # fresh install
pnpm build           # rebuild all packages in order
```

---

### Storybook won't start / missing styles

Storybook imports `packages/design-system/src/storybook.css` in `.storybook/preview.ts`. If you see unstyled components, ensure Tailwind is compiling.

**Fix:**

```bash
# Restart Storybook
pnpm storybook
```

If the problem persists, check that the `tailwind.config.ts` in `design-system` includes the content path covering your new component files.

---

### Turbo cache is serving stale output

Turbo caches task outputs. In rare cases the cache can be stale.

**Fix:**

```bash
# Run any task with cache disabled for this run
pnpm build -- --force

# Or clear the Turbo cache entirely
rm -rf .turbo
pnpm build
```
