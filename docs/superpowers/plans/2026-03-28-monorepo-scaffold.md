# CadVisor Monorepo Scaffold — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a production-grade monorepo with 3 apps (cadvisor, cadvisor-admin, desktop), 4 features (auth, dashboard, cad, settings), and 12 shared packages — all wired, building, and running.

**Architecture:** Turborepo monorepo with strict layer dependencies. Leaf packages (types, utils) at the bottom, services and core in the middle, design-system and features at the top, apps as composition roots. PlatformProvider wraps all apps. shadcn/ui components live inside design-system. 300-line max per component.

**Tech Stack:** pnpm, Turborepo, Vite, React 18, TypeScript strict, Tailwind CSS + CVA, shadcn/ui, Zustand, TanStack React Query, Tauri v2, Vitest, ESLint + boundaries plugin.

---

## Phase 1: Foundation

### Task 1: Initialize monorepo root

**Files:**

- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `.npmrc`
- Create: `.gitignore`

- [ ] **Step 1: Initialize git repo**

```bash
cd D:/Personal/demo-monoreo
git init
```

- [ ] **Step 2: Create root package.json**

```json
{
  "name": "cadvisor-monorepo",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "test": "turbo run test",
    "clean": "turbo run clean"
  },
  "devDependencies": {
    "turbo": "^2.4.0",
    "typescript": "^5.7.0"
  },
  "packageManager": "pnpm@9.15.0"
}
```

- [ ] **Step 3: Create pnpm-workspace.yaml**

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "packages/features/*"
```

- [ ] **Step 4: Create .npmrc**

```ini
auto-install-peers=true
strict-peer-dependencies=false
```

- [ ] **Step 5: Create .gitignore**

```gitignore
node_modules
dist
.turbo
*.local
.env
.env.*
!.env.example
.DS_Store
*.tsbuildinfo
```

- [ ] **Step 6: Run pnpm install**

```bash
pnpm install
```

Expected: `turbo` and `typescript` installed, `node_modules` created.

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-workspace.yaml .npmrc .gitignore pnpm-lock.yaml
git commit -m "feat: initialize monorepo root with pnpm + turborepo"
```

---

### Task 2: Configure Turborepo

**Files:**

- Create: `turbo.json`

- [ ] **Step 1: Create turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

- [ ] **Step 2: Verify turbo runs**

```bash
pnpm turbo run build
```

Expected: No packages to build yet, exits cleanly.

- [ ] **Step 3: Commit**

```bash
git add turbo.json
git commit -m "feat: add turborepo configuration"
```

---

### Task 3: Configure TypeScript base

**Files:**

- Create: `tsconfig.base.json`

- [ ] **Step 1: Create tsconfig.base.json**

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "moduleResolution": "bundler",
    "module": "ESNext",
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 2: Commit**

```bash
git add tsconfig.base.json
git commit -m "feat: add typescript base config with strict mode"
```

---

### Task 4: Configure ESLint with boundary rules

**Files:**

- Create: `eslint.config.js`
- Modify: `package.json` (add eslint devDeps)

- [ ] **Step 1: Install ESLint dependencies**

```bash
pnpm add -wD eslint @eslint/js typescript-eslint eslint-plugin-boundaries eslint-plugin-react-hooks eslint-plugin-react-refresh
```

- [ ] **Step 2: Create eslint.config.js**

```js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import boundaries from "eslint-plugin-boundaries";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      boundaries,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    settings: {
      "boundaries/elements": [
        { type: "apps", pattern: "apps/*" },
        { type: "features", pattern: "packages/features/*" },
        { type: "design-system", pattern: "packages/design-system/*" },
        { type: "store", pattern: "packages/store/*" },
        { type: "core", pattern: "packages/core/*" },
        { type: "services", pattern: "packages/services/*" },
        { type: "registry", pattern: "packages/registry/*" },
        { type: "observability", pattern: "packages/observability/*" },
        { type: "tokens", pattern: "packages/tokens/*" },
        { type: "config", pattern: "packages/config/*" },
        { type: "types", pattern: "packages/types/*" },
        { type: "utils", pattern: "packages/utils/*" },
      ],
    },
    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: "apps",
              allow: [
                "features",
                "design-system",
                "store",
                "core",
                "services",
                "registry",
                "observability",
                "tokens",
                "config",
                "types",
                "utils",
              ],
            },
            {
              from: "features",
              allow: ["design-system", "store", "core", "services", "config", "types", "utils"],
            },
            { from: "design-system", allow: ["tokens", "types", "utils"] },
            { from: "store", allow: ["core", "types", "utils"] },
            {
              from: "core",
              allow: ["services", "observability", "config", "types", "utils"],
            },
            { from: "services", allow: ["config", "types", "utils"] },
            { from: "observability", allow: ["config", "types", "utils"] },
            {
              from: "registry",
              allow: ["features", "design-system", "types"],
            },
            { from: "tokens", allow: ["types"] },
            { from: "config", allow: ["types", "utils"] },
            { from: "utils", allow: ["types"] },
            { from: "types", allow: [] },
          ],
        },
      ],
    },
  },
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/.turbo/**"],
  },
];
```

- [ ] **Step 3: Commit**

```bash
git add eslint.config.js package.json pnpm-lock.yaml
git commit -m "feat: add eslint with architecture boundary enforcement"
```

---

## Phase 2: Leaf Packages

### Task 5: Create packages/types

**Files:**

- Create: `packages/types/package.json`
- Create: `packages/types/tsconfig.json`
- Create: `packages/types/src/commands.ts`
- Create: `packages/types/src/events.ts`
- Create: `packages/types/src/models/user.ts`
- Create: `packages/types/src/models/cad.ts`
- Create: `packages/types/src/models/dashboard.ts`
- Create: `packages/types/src/index.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@repo/types",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create src/models/user.ts**

```ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user" | "viewer";
  avatarUrl?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}
```

- [ ] **Step 4: Create src/models/cad.ts**

```ts
export interface CadProject {
  id: string;
  name: string;
  description?: string;
  layers: CadLayer[];
  createdAt: string;
  updatedAt: string;
}

export interface CadLayer {
  id: string;
  name: string;
  isVisible: boolean;
  isLocked: boolean;
  elements: CadElement[];
}

export interface CadElement {
  id: string;
  type: "line" | "rect" | "circle" | "path" | "text";
  x: number;
  y: number;
  width?: number;
  height?: number;
  properties: Record<string, unknown>;
}

export type CadTool = "select" | "line" | "rect" | "circle" | "path" | "text" | "pan" | "zoom";
```

- [ ] **Step 5: Create src/models/dashboard.ts**

```ts
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalUsers: number;
  recentUpdates: number;
}

export interface ActivityItem {
  id: string;
  type: "project_created" | "project_updated" | "user_joined" | "comment_added";
  description: string;
  userId: string;
  timestamp: string;
}
```

- [ ] **Step 6: Create src/commands.ts**

```ts
export type CommandMap = {
  "auth.login": { email: string; password: string };
  "auth.logout": void;
  "auth.signup": { email: string; password: string; name: string };
  "panel.open": { type: string; props?: Record<string, unknown> };
  "panel.close": { type: string };
  "cad.select-tool": { tool: string };
  "cad.zoom": { level: number };
  "cad.save": void;
  "theme.toggle": void;
  "theme.set": { theme: "light" | "dark" | "system" };
};
```

- [ ] **Step 7: Create src/events.ts**

```ts
import type { User, AuthSession } from "./models/user";
import type { DashboardStats } from "./models/dashboard";

export type EventMap = {
  "auth.changed": { isAuthenticated: boolean; user: User | null };
  "auth.session-expired": void;
  "cad.project-loaded": { projectId: string };
  "cad.project-saved": { projectId: string };
  "cad.tool-changed": { tool: string };
  "dashboard.stats-updated": DashboardStats;
  "panel.opened": { type: string };
  "panel.closed": { type: string };
  error: { error: Error; context?: string };
  notification: { message: string; type: "info" | "success" | "warning" | "error" };
};
```

- [ ] **Step 8: Create src/index.ts**

```ts
export type { CommandMap } from "./commands";
export type { EventMap } from "./events";
export type { User, LoginCredentials, SignupCredentials, AuthSession } from "./models/user";
export type { CadProject, CadLayer, CadElement, CadTool } from "./models/cad";
export type { DashboardStats, ActivityItem } from "./models/dashboard";
```

- [ ] **Step 9: Verify type-check passes**

```bash
pnpm --filter @repo/types type-check
```

Expected: No errors.

- [ ] **Step 10: Commit**

```bash
git add packages/types
git commit -m "feat: add types package with commands, events, and models"
```

---

### Task 6: Create packages/utils

**Files:**

- Create: `packages/utils/package.json`
- Create: `packages/utils/tsconfig.json`
- Create: `packages/utils/src/cn.ts`
- Create: `packages/utils/src/format-date.ts`
- Create: `packages/utils/src/generate-id.ts`
- Create: `packages/utils/src/debounce.ts`
- Create: `packages/utils/src/index.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@repo/utils",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.6.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create src/cn.ts**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: Create src/format-date.ts**

```ts
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 30) return `${diffDay}d ago`;
  return formatDate(date);
}
```

- [ ] **Step 5: Create src/generate-id.ts**

```ts
export function generateId(): string {
  return crypto.randomUUID();
}
```

- [ ] **Step 6: Create src/debounce.ts**

```ts
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
}
```

- [ ] **Step 7: Create src/index.ts**

```ts
export { cn } from "./cn";
export { formatDate, formatRelativeTime } from "./format-date";
export { generateId } from "./generate-id";
export { debounce } from "./debounce";
```

- [ ] **Step 8: Run pnpm install and type-check**

```bash
pnpm install
pnpm --filter @repo/utils type-check
```

Expected: Install succeeds, no type errors.

- [ ] **Step 9: Commit**

```bash
git add packages/utils
git commit -m "feat: add utils package with cn, formatDate, generateId, debounce"
```

---

## Phase 3: Config + Tokens

### Task 7: Create packages/config

**Files:**

- Create: `packages/config/package.json`
- Create: `packages/config/tsconfig.json`
- Create: `packages/config/src/env.ts`
- Create: `packages/config/src/feature-flags.ts`
- Create: `packages/config/src/platform.ts`
- Create: `packages/config/src/index.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@repo/config",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create src/env.ts**

```ts
export function getEnv(key: string, fallback?: string): string {
  const value =
    typeof import.meta !== "undefined" && import.meta.env ? import.meta.env[key] : undefined;

  if (value !== undefined) return value;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing environment variable: ${key}`);
}

export function getApiBaseUrl(): string {
  return getEnv("VITE_API_BASE_URL", "http://localhost:3001");
}
```

- [ ] **Step 4: Create src/feature-flags.ts**

```ts
export interface FeatureFlags {
  enableCad: boolean;
  enableDashboard: boolean;
  enableBilling: boolean;
}

const defaultFlags: FeatureFlags = {
  enableCad: true,
  enableDashboard: true,
  enableBilling: false,
};

export function getFeatureFlags(): FeatureFlags {
  return { ...defaultFlags };
}

export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  return getFeatureFlags()[flag];
}
```

- [ ] **Step 5: Create src/platform.ts**

```ts
export type Platform = "web" | "tauri";

export function detectPlatform(): Platform {
  if (typeof window !== "undefined" && "__TAURI_INTERNALS__" in window) {
    return "tauri";
  }
  return "web";
}

export function isTauri(): boolean {
  return detectPlatform() === "tauri";
}

export function isWeb(): boolean {
  return detectPlatform() === "web";
}
```

- [ ] **Step 6: Create src/index.ts**

```ts
export { getEnv, getApiBaseUrl } from "./env";
export { getFeatureFlags, isFeatureEnabled } from "./feature-flags";
export type { FeatureFlags } from "./feature-flags";
export { detectPlatform, isTauri, isWeb } from "./platform";
export type { Platform } from "./platform";
```

- [ ] **Step 7: Commit**

```bash
git add packages/config
git commit -m "feat: add config package with env, feature flags, platform detection"
```

---

### Task 8: Create packages/tokens

**Files:**

- Create: `packages/tokens/package.json`
- Create: `packages/tokens/tsconfig.json`
- Create: `packages/tokens/src/colors.ts`
- Create: `packages/tokens/src/spacing.ts`
- Create: `packages/tokens/src/typography.ts`
- Create: `packages/tokens/src/radius.ts`
- Create: `packages/tokens/src/tailwind-preset.ts`
- Create: `packages/tokens/src/index.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@repo/tokens",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create src/colors.ts**

```ts
export const colors = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a",
  },
  success: { light: "#bbf7d0", DEFAULT: "#22c55e", dark: "#15803d" },
  warning: { light: "#fef08a", DEFAULT: "#eab308", dark: "#a16207" },
  error: { light: "#fecaca", DEFAULT: "#ef4444", dark: "#b91c1c" },
} as const;
```

- [ ] **Step 4: Create src/spacing.ts**

```ts
export const spacing = {
  px: "1px",
  0: "0px",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
} as const;
```

- [ ] **Step 5: Create src/typography.ts**

```ts
export const fontFamily = {
  sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
  mono: ["JetBrains Mono", "ui-monospace", "monospace"],
} as const;

export const fontSize = {
  xs: ["0.75rem", { lineHeight: "1rem" }],
  sm: ["0.875rem", { lineHeight: "1.25rem" }],
  base: ["1rem", { lineHeight: "1.5rem" }],
  lg: ["1.125rem", { lineHeight: "1.75rem" }],
  xl: ["1.25rem", { lineHeight: "1.75rem" }],
  "2xl": ["1.5rem", { lineHeight: "2rem" }],
  "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
  "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
} as const;
```

- [ ] **Step 6: Create src/radius.ts**

```ts
export const radius = {
  none: "0px",
  sm: "0.125rem",
  DEFAULT: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  full: "9999px",
} as const;
```

- [ ] **Step 7: Create src/tailwind-preset.ts**

```ts
import type { Config } from "tailwindcss";
import { colors } from "./colors";
import { spacing } from "./spacing";
import { fontFamily, fontSize } from "./typography";
import { radius } from "./radius";

export const tailwindPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        neutral: colors.neutral,
        success: colors.success,
        warning: colors.warning,
        error: colors.error,
      },
      spacing,
      fontFamily: {
        sans: [...fontFamily.sans],
        mono: [...fontFamily.mono],
      },
      fontSize: fontSize as unknown as Record<string, string>,
      borderRadius: radius,
    },
  },
};
```

- [ ] **Step 8: Create src/index.ts**

```ts
export { colors } from "./colors";
export { spacing } from "./spacing";
export { fontFamily, fontSize } from "./typography";
export { radius } from "./radius";
export { tailwindPreset } from "./tailwind-preset";
```

- [ ] **Step 9: Commit**

```bash
pnpm install
git add packages/tokens
git commit -m "feat: add tokens package with colors, spacing, typography, radius, tailwind preset"
```

---

## Phase 4: Service Layer

### Task 9: Create packages/services

**Files:**

- Create: `packages/services/package.json`
- Create: `packages/services/tsconfig.json`
- Create: `packages/services/src/auth.service.ts`
- Create: `packages/services/src/cad.service.ts`
- Create: `packages/services/src/dashboard.service.ts`
- Create: `packages/services/src/user.service.ts`
- Create: `packages/services/src/platform/web.ts`
- Create: `packages/services/src/platform/tauri.ts`
- Create: `packages/services/src/context.tsx`
- Create: `packages/services/src/index.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@repo/services",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@repo/config": "workspace:*",
    "@repo/types": "workspace:*",
    "@repo/utils": "workspace:*",
    "react": "^18.3.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create src/auth.service.ts**

```ts
import type { AuthSession, LoginCredentials, SignupCredentials } from "@repo/types";

export interface AuthService {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  signup(credentials: SignupCredentials): Promise<AuthSession>;
  logout(): Promise<void>;
  getSession(): Promise<AuthSession | null>;
}
```

- [ ] **Step 4: Create src/cad.service.ts**

```ts
import type { CadProject } from "@repo/types";

export interface CadService {
  getProject(id: string): Promise<CadProject>;
  listProjects(): Promise<CadProject[]>;
  saveProject(project: CadProject): Promise<CadProject>;
  deleteProject(id: string): Promise<void>;
}
```

- [ ] **Step 5: Create src/dashboard.service.ts**

```ts
import type { DashboardStats, ActivityItem } from "@repo/types";

export interface DashboardService {
  getStats(): Promise<DashboardStats>;
  getRecentActivity(limit?: number): Promise<ActivityItem[]>;
}
```

- [ ] **Step 6: Create src/user.service.ts**

```ts
import type { User } from "@repo/types";

export interface UserService {
  getProfile(): Promise<User>;
  updateProfile(data: Partial<User>): Promise<User>;
}
```

- [ ] **Step 7: Create src/platform/web.ts**

```ts
import { getApiBaseUrl } from "@repo/config";
import type { AuthService } from "../auth.service";
import type { CadService } from "../cad.service";
import type { DashboardService } from "../dashboard.service";
import type { UserService } from "../user.service";

function apiUrl(path: string): string {
  return `${getApiBaseUrl()}${path}`;
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const webAuthService: AuthService = {
  login: (creds) =>
    fetchJson(apiUrl("/auth/login"), { method: "POST", body: JSON.stringify(creds) }),
  signup: (creds) =>
    fetchJson(apiUrl("/auth/signup"), { method: "POST", body: JSON.stringify(creds) }),
  logout: () => fetchJson(apiUrl("/auth/logout"), { method: "POST" }),
  getSession: () => fetchJson(apiUrl("/auth/session")),
};

export const webCadService: CadService = {
  getProject: (id) => fetchJson(apiUrl(`/cad/projects/${id}`)),
  listProjects: () => fetchJson(apiUrl("/cad/projects")),
  saveProject: (project) =>
    fetchJson(apiUrl(`/cad/projects/${project.id}`), {
      method: "PUT",
      body: JSON.stringify(project),
    }),
  deleteProject: (id) => fetchJson(apiUrl(`/cad/projects/${id}`), { method: "DELETE" }),
};

export const webDashboardService: DashboardService = {
  getStats: () => fetchJson(apiUrl("/dashboard/stats")),
  getRecentActivity: (limit = 10) => fetchJson(apiUrl(`/dashboard/activity?limit=${limit}`)),
};

export const webUserService: UserService = {
  getProfile: () => fetchJson(apiUrl("/user/profile")),
  updateProfile: (data) =>
    fetchJson(apiUrl("/user/profile"), { method: "PATCH", body: JSON.stringify(data) }),
};
```

- [ ] **Step 8: Create src/platform/tauri.ts**

```ts
import type { AuthService } from "../auth.service";
import type { CadService } from "../cad.service";
import type { DashboardService } from "../dashboard.service";
import type { UserService } from "../user.service";

async function invoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  const { invoke: tauriInvoke } = await import("@tauri-apps/api/core");
  return tauriInvoke<T>(command, args);
}

export const tauriAuthService: AuthService = {
  login: (creds) => invoke("auth_login", { credentials: creds }),
  signup: (creds) => invoke("auth_signup", { credentials: creds }),
  logout: () => invoke("auth_logout"),
  getSession: () => invoke("auth_get_session"),
};

export const tauriCadService: CadService = {
  getProject: (id) => invoke("cad_get_project", { id }),
  listProjects: () => invoke("cad_list_projects"),
  saveProject: (project) => invoke("cad_save_project", { project }),
  deleteProject: (id) => invoke("cad_delete_project", { id }),
};

export const tauriDashboardService: DashboardService = {
  getStats: () => invoke("dashboard_get_stats"),
  getRecentActivity: (limit = 10) => invoke("dashboard_get_activity", { limit }),
};

export const tauriUserService: UserService = {
  getProfile: () => invoke("user_get_profile"),
  updateProfile: (data) => invoke("user_update_profile", { data }),
};
```

- [ ] **Step 9: Create src/context.tsx**

```tsx
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { detectPlatform } from "@repo/config";
import type { AuthService } from "./auth.service";
import type { CadService } from "./cad.service";
import type { DashboardService } from "./dashboard.service";
import type { UserService } from "./user.service";
import { webAuthService, webCadService, webDashboardService, webUserService } from "./platform/web";
import {
  tauriAuthService,
  tauriCadService,
  tauriDashboardService,
  tauriUserService,
} from "./platform/tauri";

export interface Services {
  auth: AuthService;
  cad: CadService;
  dashboard: DashboardService;
  user: UserService;
}

const ServiceContext = createContext<Services | null>(null);

function createServices(): Services {
  const platform = detectPlatform();

  if (platform === "tauri") {
    return {
      auth: tauriAuthService,
      cad: tauriCadService,
      dashboard: tauriDashboardService,
      user: tauriUserService,
    };
  }

  return {
    auth: webAuthService,
    cad: webCadService,
    dashboard: webDashboardService,
    user: webUserService,
  };
}

interface ServiceProviderProps {
  children: ReactNode;
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  const services = useMemo(() => createServices(), []);
  return <ServiceContext.Provider value={services}>{children}</ServiceContext.Provider>;
}

export function useServices(): Services {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error("useServices must be used within ServiceProvider");
  return ctx;
}
```

- [ ] **Step 10: Create src/index.ts**

```ts
export type { AuthService } from "./auth.service";
export type { CadService } from "./cad.service";
export type { DashboardService } from "./dashboard.service";
export type { UserService } from "./user.service";
export type { Services } from "./context";
export { ServiceProvider, useServices } from "./context";
```

- [ ] **Step 11: Install and commit**

```bash
pnpm install
git add packages/services
git commit -m "feat: add services package with web + tauri implementations and DI context"
```

---

## Phase 5: Core System

### Task 10: Create packages/core

**Files:**

- Create: `packages/core/package.json`
- Create: `packages/core/tsconfig.json`
- Create: `packages/core/src/commands.ts`
- Create: `packages/core/src/events.ts`
- Create: `packages/core/src/query-client.ts`
- Create: `packages/core/src/hooks/use-event.ts`
- Create: `packages/core/src/provider/platform-provider.tsx`
- Create: `packages/core/src/index.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@repo/core",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@repo/services": "workspace:*",
    "@repo/config": "workspace:*",
    "@repo/types": "workspace:*",
    "@repo/utils": "workspace:*",
    "@tanstack/react-query": "^5.62.0",
    "react": "^18.3.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create src/commands.ts**

```ts
import type { CommandMap } from "@repo/types";

type CommandHandler<K extends keyof CommandMap> = CommandMap[K] extends void
  ? () => void | Promise<void>
  : (payload: CommandMap[K]) => void | Promise<void>;

const handlers = new Map<string, Function>();

export function registerCommand<K extends keyof CommandMap>(
  command: K,
  handler: CommandHandler<K>,
): void {
  handlers.set(command, handler);
}

export function executeCommand<K extends keyof CommandMap>(
  ...args: CommandMap[K] extends void ? [K] : [K, CommandMap[K]]
): void {
  const [command, payload] = args;
  const handler = handlers.get(command);
  if (!handler) {
    if (import.meta.env.DEV) {
      console.warn(`[CORE] No handler registered for command: ${command}`);
    }
    return;
  }
  handler(payload);
}
```

- [ ] **Step 4: Create src/events.ts**

```ts
import type { EventMap } from "@repo/types";

type Listener<K extends keyof EventMap> = EventMap[K] extends void
  ? () => void
  : (data: EventMap[K]) => void;

const listeners = new Map<string, Set<Function>>();

export function emit<K extends keyof EventMap>(
  ...args: EventMap[K] extends void ? [K] : [K, EventMap[K]]
): void {
  const [event, data] = args;
  if (import.meta.env.DEV) {
    console.log("[EVENT]", event, data);
  }
  listeners.get(event)?.forEach((fn) => fn(data));
}

export function on<K extends keyof EventMap>(event: K, handler: Listener<K>): () => void {
  if (!listeners.has(event)) {
    listeners.set(event, new Set());
  }
  listeners.get(event)!.add(handler);

  return () => {
    listeners.get(event)?.delete(handler);
  };
}
```

- [ ] **Step 5: Create src/query-client.ts**

```ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
```

- [ ] **Step 6: Create src/hooks/use-event.ts**

```ts
import { useEffect } from "react";
import type { EventMap } from "@repo/types";
import { on } from "../events";

type EventHandler<K extends keyof EventMap> = EventMap[K] extends void
  ? () => void
  : (data: EventMap[K]) => void;

export function useEvent<K extends keyof EventMap>(event: K, handler: EventHandler<K>): void {
  useEffect(() => {
    const unsub = on(event, handler);
    return unsub;
  }, [event, handler]);
}
```

- [ ] **Step 7: Create src/provider/platform-provider.tsx**

```tsx
import { type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ServiceProvider } from "@repo/services";
import { queryClient } from "../query-client";

interface PlatformProviderProps {
  children: ReactNode;
}

export function PlatformProvider({ children }: PlatformProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ServiceProvider>{children}</ServiceProvider>
    </QueryClientProvider>
  );
}
```

- [ ] **Step 8: Create src/index.ts**

```ts
export { registerCommand, executeCommand } from "./commands";
export { emit, on } from "./events";
export { queryClient } from "./query-client";
export { useEvent } from "./hooks/use-event";
export { PlatformProvider } from "./provider/platform-provider";
```

- [ ] **Step 9: Install and commit**

```bash
pnpm install
git add packages/core
git commit -m "feat: add core package with typed commands, events, query client, PlatformProvider"
```

---

## Phase 6: State Layer

### Task 11: Create packages/store

**Files:**

- Create: `packages/store/package.json`
- Create: `packages/store/tsconfig.json`
- Create: `packages/store/src/layout.store.ts`
- Create: `packages/store/src/auth.store.ts`
- Create: `packages/store/src/cad.store.ts`
- Create: `packages/store/src/settings.store.ts`
- Create: `packages/store/src/index.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@repo/store",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@repo/core": "workspace:*",
    "@repo/types": "workspace:*",
    "@repo/utils": "workspace:*",
    "zustand": "^5.0.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create src/layout.store.ts**

```ts
import { create } from "zustand";

interface PanelEntry {
  type: string;
  props?: Record<string, unknown>;
}

interface LayoutState {
  sidebarOpen: boolean;
  theme: "light" | "dark" | "system";
  activePanels: PanelEntry[];

  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  openPanel: (type: string, props?: Record<string, unknown>) => void;
  closePanel: (type: string) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  sidebarOpen: true,
  theme: "system",
  activePanels: [],

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  setTheme: (theme) => set({ theme }),
  openPanel: (type, props) =>
    set((s) => ({
      activePanels: [...s.activePanels.filter((p) => p.type !== type), { type, props }],
    })),
  closePanel: (type) =>
    set((s) => ({
      activePanels: s.activePanels.filter((p) => p.type !== type),
    })),
}));
```

- [ ] **Step 4: Create src/auth.store.ts**

```ts
import { create } from "zustand";

interface AuthState {
  isLoginModalOpen: boolean;
  redirectAfterLogin: string | null;

  openLoginModal: (redirect?: string) => void;
  closeLoginModal: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoginModalOpen: false,
  redirectAfterLogin: null,

  openLoginModal: (redirect) =>
    set({ isLoginModalOpen: true, redirectAfterLogin: redirect ?? null }),
  closeLoginModal: () => set({ isLoginModalOpen: false, redirectAfterLogin: null }),
}));
```

- [ ] **Step 5: Create src/cad.store.ts**

```ts
import { create } from "zustand";
import type { CadTool } from "@repo/types";

interface CadState {
  selectedTool: CadTool;
  zoomLevel: number;
  activeLayerId: string | null;
  isPanelVisible: boolean;

  setTool: (tool: CadTool) => void;
  setZoom: (level: number) => void;
  setActiveLayer: (id: string | null) => void;
  togglePanel: () => void;
}

export const useCadStore = create<CadState>((set) => ({
  selectedTool: "select",
  zoomLevel: 100,
  activeLayerId: null,
  isPanelVisible: true,

  setTool: (tool) => set({ selectedTool: tool }),
  setZoom: (level) => set({ zoomLevel: Math.max(10, Math.min(500, level)) }),
  setActiveLayer: (id) => set({ activeLayerId: id }),
  togglePanel: () => set((s) => ({ isPanelVisible: !s.isPanelVisible })),
}));
```

- [ ] **Step 6: Create src/settings.store.ts**

```ts
import { create } from "zustand";

interface SettingsState {
  language: string;
  notificationsEnabled: boolean;
  autoSave: boolean;

  setLanguage: (lang: string) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setAutoSave: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  language: "en",
  notificationsEnabled: true,
  autoSave: true,

  setLanguage: (language) => set({ language }),
  setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
  setAutoSave: (autoSave) => set({ autoSave }),
}));
```

- [ ] **Step 7: Create src/index.ts**

```ts
export { useLayoutStore } from "./layout.store";
export { useAuthStore } from "./auth.store";
export { useCadStore } from "./cad.store";
export { useSettingsStore } from "./settings.store";
```

- [ ] **Step 8: Install and commit**

```bash
pnpm install
git add packages/store
git commit -m "feat: add store package with layout, auth, cad, settings stores"
```

---

## Phase 7: Design System

### Task 12: Create design-system package structure + primitives

**Files:**

- Create: `packages/design-system/package.json`
- Create: `packages/design-system/tsconfig.json`
- Create: `packages/design-system/src/primitives/box.tsx`
- Create: `packages/design-system/src/primitives/stack.tsx`
- Create: `packages/design-system/src/primitives/grid.tsx`
- Create: `packages/design-system/src/primitives/flex.tsx`
- Create: `packages/design-system/src/primitives/index.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@repo/design-system",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@repo/tokens": "workspace:*",
    "@repo/types": "workspace:*",
    "@repo/utils": "workspace:*",
    "react": "^18.3.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-slot": "^1.1.0",
    "class-variance-authority": "^0.7.0",
    "lucide-react": "^0.460.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create src/primitives/box.tsx**

```tsx
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@repo/utils";

interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "article" | "aside" | "main" | "header" | "footer" | "nav";
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ as: Component = "div", className, ...props }, ref) => {
    return <Component ref={ref} className={cn(className)} {...props} />;
  },
);
Box.displayName = "Box";
```

- [ ] **Step 4: Create src/primitives/stack.tsx**

```tsx
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@repo/utils";
import { cva, type VariantProps } from "class-variance-authority";

const stackVariants = cva("flex flex-col", {
  variants: {
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
  },
  defaultVariants: {
    gap: "md",
    align: "stretch",
  },
});

interface StackProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof stackVariants> {}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ className, gap, align, ...props }, ref) => {
    return <div ref={ref} className={cn(stackVariants({ gap, align }), className)} {...props} />;
  },
);
Stack.displayName = "Stack";
```

- [ ] **Step 5: Create src/primitives/grid.tsx**

```tsx
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@repo/utils";
import { cva, type VariantProps } from "class-variance-authority";

const gridVariants = cva("grid", {
  variants: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      6: "grid-cols-6",
      12: "grid-cols-12",
    },
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
  },
  defaultVariants: {
    cols: 1,
    gap: "md",
  },
});

interface GridProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof gridVariants> {}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, ...props }, ref) => {
    return <div ref={ref} className={cn(gridVariants({ cols, gap }), className)} {...props} />;
  },
);
Grid.displayName = "Grid";
```

- [ ] **Step 6: Create src/primitives/flex.tsx**

```tsx
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@repo/utils";
import { cva, type VariantProps } from "class-variance-authority";

const flexVariants = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      col: "flex-col",
      rowReverse: "flex-row-reverse",
      colReverse: "flex-col-reverse",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
    wrap: {
      wrap: "flex-wrap",
      nowrap: "flex-nowrap",
      wrapReverse: "flex-wrap-reverse",
    },
  },
  defaultVariants: {
    direction: "row",
    align: "start",
    justify: "start",
    gap: "none",
    wrap: "nowrap",
  },
});

interface FlexProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof flexVariants> {}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  ({ className, direction, align, justify, gap, wrap, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(flexVariants({ direction, align, justify, gap, wrap }), className)}
        {...props}
      />
    );
  },
);
Flex.displayName = "Flex";
```

- [ ] **Step 7: Create src/primitives/index.ts**

```ts
export { Box } from "./box";
export { Stack } from "./stack";
export { Grid } from "./grid";
export { Flex } from "./flex";
```

- [ ] **Step 8: Commit**

```bash
pnpm install
git add packages/design-system
git commit -m "feat: add design-system primitives (Box, Stack, Grid, Flex)"
```

---

### Task 13: Add typography components

**Files:**

- Create: `packages/design-system/src/typography/heading.tsx`
- Create: `packages/design-system/src/typography/text.tsx`
- Create: `packages/design-system/src/typography/label.tsx`
- Create: `packages/design-system/src/typography/code.tsx`
- Create: `packages/design-system/src/typography/index.ts`

- [ ] **Step 1: Create heading.tsx**

```tsx
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@repo/utils";
import { cva, type VariantProps } from "class-variance-authority";

const headingVariants = cva("font-bold tracking-tight", {
  variants: {
    level: {
      1: "text-4xl lg:text-5xl",
      2: "text-3xl lg:text-4xl",
      3: "text-2xl lg:text-3xl",
      4: "text-xl lg:text-2xl",
    },
  },
  defaultVariants: {
    level: 1,
  },
});

interface HeadingProps
  extends HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {}

export const H1 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, "level">>(
  ({ className, ...props }, ref) => (
    <h1 ref={ref} className={cn(headingVariants({ level: 1 }), className)} {...props} />
  ),
);
H1.displayName = "H1";

export const H2 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, "level">>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn(headingVariants({ level: 2 }), className)} {...props} />
  ),
);
H2.displayName = "H2";

export const H3 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, "level">>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn(headingVariants({ level: 3 }), className)} {...props} />
  ),
);
H3.displayName = "H3";
```

- [ ] **Step 2: Create text.tsx**

```tsx
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@repo/utils";
import { cva, type VariantProps } from "class-variance-authority";

const textVariants = cva("", {
  variants: {
    variant: {
      default: "text-neutral-900 dark:text-neutral-100",
      muted: "text-neutral-500 dark:text-neutral-400",
      error: "text-error",
      success: "text-success",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "base",
  },
});

interface TextProps
  extends HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div";
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ as: Component = "p", className, variant, size, ...props }, ref) => (
    <Component ref={ref} className={cn(textVariants({ variant, size }), className)} {...props} />
  ),
);
Text.displayName = "Text";
```

- [ ] **Step 3: Create label.tsx**

```tsx
import { forwardRef } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@repo/utils";

interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {}

export const Label = forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, ...props }, ref) => (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  ),
);
Label.displayName = "Label";
```

- [ ] **Step 4: Create code.tsx**

```tsx
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@repo/utils";

interface CodeProps extends HTMLAttributes<HTMLElement> {}

export const Code = forwardRef<HTMLElement, CodeProps>(({ className, ...props }, ref) => (
  <code
    ref={ref}
    className={cn(
      "relative rounded bg-neutral-100 px-[0.3rem] py-[0.2rem] font-mono text-sm dark:bg-neutral-800",
      className,
    )}
    {...props}
  />
));
Code.displayName = "Code";
```

- [ ] **Step 5: Create index.ts**

```ts
export { H1, H2, H3 } from "./heading";
export { Text } from "./text";
export { Label } from "./label";
export { Code } from "./code";
```

- [ ] **Step 6: Commit**

```bash
git add packages/design-system/src/typography
git commit -m "feat: add typography components (H1-H3, Text, Label, Code)"
```

---

### Task 14: Add shadcn/ui components (Button, Card, Input, Modal, Loader, ErrorView)

**Files:**

- Create: `packages/design-system/src/components/button.tsx`
- Create: `packages/design-system/src/components/card.tsx`
- Create: `packages/design-system/src/components/input.tsx`
- Create: `packages/design-system/src/components/modal.tsx`
- Create: `packages/design-system/src/components/loader.tsx`
- Create: `packages/design-system/src/components/error-view.tsx`
- Create: `packages/design-system/src/components/index.ts`

- [ ] **Step 1: Create button.tsx (shadcn pattern)**

```tsx
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@repo/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950",
  {
    variants: {
      variant: {
        default:
          "bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600",
        destructive: "bg-error text-white hover:bg-error/90",
        outline:
          "border border-neutral-200 bg-white hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800",
        secondary:
          "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700",
        ghost: "hover:bg-neutral-100 dark:hover:bg-neutral-800",
        link: "text-primary-600 underline-offset-4 hover:underline dark:text-primary-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isAsChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isAsChild = false, ...props }, ref) => {
    const Comp = isAsChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
```

- [ ] **Step 2: Create card.tsx**

```tsx
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@repo/utils";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-neutral-200 bg-white text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-neutral-500 dark:text-neutral-400", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";
```

- [ ] **Step 3: Create input.tsx**

```tsx
import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@repo/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
```

- [ ] **Step 4: Create modal.tsx (wraps Radix Dialog)**

```tsx
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@repo/utils";

export const Modal = DialogPrimitive.Root;
export const ModalTrigger = DialogPrimitive.Trigger;
export const ModalClose = DialogPrimitive.Close;

export const ModalOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
ModalOverlay.displayName = "ModalOverlay";

export const ModalContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <ModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-neutral-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:border-neutral-800 dark:bg-neutral-950",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:pointer-events-none dark:ring-offset-neutral-950">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
ModalContent.displayName = "ModalContent";

export const ModalHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);

export const ModalTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
ModalTitle.displayName = "ModalTitle";
```

- [ ] **Step 5: Create loader.tsx**

```tsx
import { cn } from "@repo/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Loader({ className, size = "md" }: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-primary-600 border-t-transparent",
        sizeClasses[size],
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
```

- [ ] **Step 6: Create error-view.tsx**

```tsx
import { cn } from "@repo/utils";
import { AlertCircle } from "lucide-react";

interface ErrorViewProps {
  message?: string;
  className?: string;
  onRetry?: () => void;
}

export function ErrorView({
  message = "Something went wrong",
  className,
  onRetry,
}: ErrorViewProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border border-error/20 bg-error/5 p-6 text-center",
        className,
      )}
      role="alert"
    >
      <AlertCircle className="h-10 w-10 text-error" />
      <p className="text-sm text-neutral-600 dark:text-neutral-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md bg-error px-4 py-2 text-sm font-medium text-white hover:bg-error/90 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 7: Create components/index.ts**

```ts
export { Button, buttonVariants } from "./button";
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";
export { Input } from "./input";
export {
  Modal,
  ModalTrigger,
  ModalClose,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "./modal";
export { Loader } from "./loader";
export { ErrorView } from "./error-view";
```

- [ ] **Step 8: Create theme provider and root index**

Create `packages/design-system/src/theme/theme-provider.tsx`:

```tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "cadvisor-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
```

Create `packages/design-system/src/theme/index.ts`:

```ts
export { ThemeProvider, useTheme } from "./theme-provider";
```

Create `packages/design-system/src/index.ts`:

```ts
export { Box, Stack, Grid, Flex } from "./primitives";
export { H1, H2, H3 } from "./typography/heading";
export { Text } from "./typography/text";
export { Label } from "./typography/label";
export { Code } from "./typography/code";
export {
  Button,
  buttonVariants,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Modal,
  ModalTrigger,
  ModalClose,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  Loader,
  ErrorView,
} from "./components";
export { ThemeProvider, useTheme } from "./theme";
```

- [ ] **Step 9: Install and commit**

```bash
pnpm install
git add packages/design-system
git commit -m "feat: add design-system with shadcn components, primitives, typography, theme"
```

---

## Phase 8: Features

### Task 15: Create feature-auth

**Files:**

- Create: `packages/features/auth/package.json`
- Create: `packages/features/auth/tsconfig.json`
- Create: `packages/features/auth/src/hooks/use-login.ts`
- Create: `packages/features/auth/src/hooks/use-signup.ts`
- Create: `packages/features/auth/src/hooks/use-auth.ts`
- Create: `packages/features/auth/src/components/login-form.tsx`
- Create: `packages/features/auth/src/components/signup-form.tsx`
- Create: `packages/features/auth/src/components/auth-guard.tsx`
- Create: `packages/features/auth/src/index.ts`

- [ ] **Step 1: Create package.json and tsconfig.json**

`packages/features/auth/package.json`:

```json
{
  "name": "@repo/feature-auth",
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

`packages/features/auth/tsconfig.json`:

```json
{
  "extends": "../../../tsconfig.base.json",
  "compilerOptions": { "outDir": "dist", "rootDir": "src" },
  "include": ["src"]
}
```

- [ ] **Step 2: Create hooks**

`src/hooks/use-login.ts`:

```ts
import { useMutation } from "@tanstack/react-query";
import { useServices } from "@repo/services";
import { emit } from "@repo/core";
import type { LoginCredentials } from "@repo/types";

export function useLogin() {
  const { auth } = useServices();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => auth.login(credentials),
    onSuccess: (session) => {
      emit("auth.changed", { isAuthenticated: true, user: session.user });
    },
    onError: (error) => {
      emit("error", { error: error as Error, context: "auth.login" });
    },
  });
}
```

`src/hooks/use-signup.ts`:

```ts
import { useMutation } from "@tanstack/react-query";
import { useServices } from "@repo/services";
import { emit } from "@repo/core";
import type { SignupCredentials } from "@repo/types";

export function useSignup() {
  const { auth } = useServices();

  return useMutation({
    mutationFn: (credentials: SignupCredentials) => auth.signup(credentials),
    onSuccess: (session) => {
      emit("auth.changed", { isAuthenticated: true, user: session.user });
    },
    onError: (error) => {
      emit("error", { error: error as Error, context: "auth.signup" });
    },
  });
}
```

`src/hooks/use-auth.ts`:

```ts
import { useQuery } from "@tanstack/react-query";
import { useServices } from "@repo/services";

export function useAuth() {
  const { auth } = useServices();

  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: () => auth.getSession(),
    retry: false,
  });

  return {
    user: sessionQuery.data?.user ?? null,
    isAuthenticated: !!sessionQuery.data,
    isLoading: sessionQuery.isLoading,
  };
}
```

- [ ] **Step 3: Create components**

`src/components/login-form.tsx`:

```tsx
import { useState, type FormEvent } from "react";
import { Button, Input, Stack, H2, Text } from "@repo/design-system";
import { Label } from "@repo/design-system";
import { useLogin } from "../hooks/use-login";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    login.mutate({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <Stack gap="lg">
        <Stack gap="xs">
          <H2>Sign In</H2>
          <Text variant="muted" size="sm">
            Enter your credentials to continue
          </Text>
        </Stack>

        <Stack gap="sm">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Stack>

        <Stack gap="sm">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Stack>

        {login.error && (
          <Text variant="error" size="sm">
            {login.error.message}
          </Text>
        )}

        <Button type="submit" disabled={login.isPending}>
          {login.isPending ? "Signing in..." : "Sign In"}
        </Button>
      </Stack>
    </form>
  );
}
```

`src/components/signup-form.tsx`:

```tsx
import { useState, type FormEvent } from "react";
import { Button, Input, Stack, H2, Text } from "@repo/design-system";
import { Label } from "@repo/design-system";
import { useSignup } from "../hooks/use-signup";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signup = useSignup();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    signup.mutate({ email, password, name });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <Stack gap="lg">
        <Stack gap="xs">
          <H2>Create Account</H2>
          <Text variant="muted" size="sm">
            Enter your details to get started
          </Text>
        </Stack>

        <Stack gap="sm">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Stack>

        <Stack gap="sm">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Stack>

        <Stack gap="sm">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Stack>

        {signup.error && (
          <Text variant="error" size="sm">
            {signup.error.message}
          </Text>
        )}

        <Button type="submit" disabled={signup.isPending}>
          {signup.isPending ? "Creating account..." : "Create Account"}
        </Button>
      </Stack>
    </form>
  );
}
```

`src/components/auth-guard.tsx`:

```tsx
import { type ReactNode } from "react";
import { Loader } from "@repo/design-system";
import { useAuth } from "../hooks/use-auth";
import { LoginForm } from "./login-form";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoginForm />
      </div>
    );
  }

  return <>{children}</>;
}
```

- [ ] **Step 4: Create src/index.ts**

```ts
export { LoginForm } from "./components/login-form";
export { SignupForm } from "./components/signup-form";
export { AuthGuard } from "./components/auth-guard";
export { useAuth } from "./hooks/use-auth";
export { useLogin } from "./hooks/use-login";
export { useSignup } from "./hooks/use-signup";
```

- [ ] **Step 5: Install and commit**

```bash
pnpm install
git add packages/features/auth
git commit -m "feat: add feature-auth with login, signup, auth guard"
```

---

### Task 16: Create feature-dashboard

**Files:**

- Create: `packages/features/dashboard/package.json`, `tsconfig.json`
- Create: `packages/features/dashboard/src/hooks/use-dashboard-stats.ts`
- Create: `packages/features/dashboard/src/hooks/use-recent-activity.ts`
- Create: `packages/features/dashboard/src/components/stat-card.tsx`
- Create: `packages/features/dashboard/src/components/recent-activity.tsx`
- Create: `packages/features/dashboard/src/components/quick-actions.tsx`
- Create: `packages/features/dashboard/src/components/dashboard-page.tsx`
- Create: `packages/features/dashboard/src/index.ts`

- [ ] **Step 1: Create package.json and tsconfig.json**

Same structure as feature-auth. `package.json` name: `@repo/feature-dashboard`. Same dependencies. tsconfig extends `../../../tsconfig.base.json`.

- [ ] **Step 2: Create hooks**

`src/hooks/use-dashboard-stats.ts`:

```ts
import { useQuery } from "@tanstack/react-query";
import { useServices } from "@repo/services";

export function useDashboardStats() {
  const { dashboard } = useServices();
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => dashboard.getStats(),
  });
}
```

`src/hooks/use-recent-activity.ts`:

```ts
import { useQuery } from "@tanstack/react-query";
import { useServices } from "@repo/services";

export function useRecentActivity(limit = 10) {
  const { dashboard } = useServices();
  return useQuery({
    queryKey: ["dashboard", "activity", limit],
    queryFn: () => dashboard.getRecentActivity(limit),
  });
}
```

- [ ] **Step 3: Create components**

`src/components/stat-card.tsx`:

```tsx
import { Card, CardContent, CardHeader, CardTitle, Text } from "@repo/design-system";

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
}

export function StatCard({ title, value, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <Text variant="muted" size="xs">
            {description}
          </Text>
        )}
      </CardContent>
    </Card>
  );
}
```

`src/components/recent-activity.tsx`:

```tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Text,
  Stack,
  Loader,
  ErrorView,
} from "@repo/design-system";
import { formatRelativeTime } from "@repo/utils";
import { useRecentActivity } from "../hooks/use-recent-activity";

export function RecentActivity() {
  const { data, isLoading, error, refetch } = useRecentActivity(5);

  if (isLoading) return <Loader />;
  if (error) return <ErrorView message={error.message} onRetry={() => refetch()} />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap="sm">
          {data?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800 last:border-0"
            >
              <Text size="sm">{item.description}</Text>
              <Text variant="muted" size="xs">
                {formatRelativeTime(item.timestamp)}
              </Text>
            </div>
          ))}
          {data?.length === 0 && (
            <Text variant="muted" size="sm">
              No recent activity
            </Text>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
```

`src/components/quick-actions.tsx`:

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle, Flex } from "@repo/design-system";
import { executeCommand } from "@repo/core";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <Flex gap="sm" wrap="wrap">
          <Button variant="outline" onClick={() => executeCommand("panel.open", { type: "cad" })}>
            New Project
          </Button>
          <Button
            variant="outline"
            onClick={() => executeCommand("panel.open", { type: "settings" })}
          >
            Settings
          </Button>
        </Flex>
      </CardContent>
    </Card>
  );
}
```

`src/components/dashboard-page.tsx`:

```tsx
import { Stack, Grid, H1, Text, Loader, ErrorView } from "@repo/design-system";
import { useDashboardStats } from "../hooks/use-dashboard-stats";
import { StatCard } from "./stat-card";
import { RecentActivity } from "./recent-activity";
import { QuickActions } from "./quick-actions";

export function DashboardPage() {
  const { data: stats, isLoading, error, refetch } = useDashboardStats();

  if (isLoading)
    return (
      <div className="flex justify-center p-12">
        <Loader size="lg" />
      </div>
    );
  if (error) return <ErrorView message={error.message} onRetry={() => refetch()} />;

  return (
    <Stack gap="lg" className="p-6">
      <Stack gap="xs">
        <H1>Dashboard</H1>
        <Text variant="muted">Overview of your workspace</Text>
      </Stack>

      <Grid cols={4} gap="md">
        <StatCard title="Total Projects" value={stats?.totalProjects ?? 0} />
        <StatCard title="Active Projects" value={stats?.activeProjects ?? 0} />
        <StatCard title="Total Users" value={stats?.totalUsers ?? 0} />
        <StatCard title="Recent Updates" value={stats?.recentUpdates ?? 0} />
      </Grid>

      <Grid cols={2} gap="md">
        <RecentActivity />
        <QuickActions />
      </Grid>
    </Stack>
  );
}
```

- [ ] **Step 4: Create src/index.ts**

```ts
export { DashboardPage } from "./components/dashboard-page";
export { StatCard } from "./components/stat-card";
export { RecentActivity } from "./components/recent-activity";
export { QuickActions } from "./components/quick-actions";
export { useDashboardStats } from "./hooks/use-dashboard-stats";
export { useRecentActivity } from "./hooks/use-recent-activity";
```

- [ ] **Step 5: Commit**

```bash
pnpm install
git add packages/features/dashboard
git commit -m "feat: add feature-dashboard with stats, activity, quick actions"
```

---

### Task 17: Create feature-cad (scaffold)

Follow same pattern as auth/dashboard. Key files:

- [ ] **Step 1: Create package.json, tsconfig.json** — same as other features, name: `@repo/feature-cad`
- [ ] **Step 2: Create hooks** — `use-cad-project.ts` (useQuery for project), `use-cad-tools.ts` (reads from useCadStore)
- [ ] **Step 3: Create components** — `cad-canvas.tsx` (placeholder canvas div), `cad-toolbar.tsx` (tool buttons), `cad-layer-panel.tsx` (layer list), `cad-properties-panel.tsx` (element properties)
- [ ] **Step 4: Create index.ts** — export all public components and hooks
- [ ] **Step 5: Commit**

```bash
git commit -m "feat: add feature-cad with canvas, toolbar, layer panel"
```

---

### Task 18: Create feature-settings (scaffold)

Follow same pattern. Key files:

- [ ] **Step 1: Create package.json, tsconfig.json** — name: `@repo/feature-settings`
- [ ] **Step 2: Create hooks** — `use-settings.ts`, `use-profile.ts`
- [ ] **Step 3: Create components** — `settings-page.tsx`, `profile-section.tsx`, `appearance-section.tsx`, `notification-section.tsx`
- [ ] **Step 4: Create index.ts**
- [ ] **Step 5: Commit**

```bash
git commit -m "feat: add feature-settings with profile, appearance, notifications"
```

---

## Phase 9: Registry + Observability

### Task 19: Create packages/registry

**Files:**

- Create: `packages/registry/package.json`
- Create: `packages/registry/tsconfig.json`
- Create: `packages/registry/src/index.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@repo/registry",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": { "type-check": "tsc --noEmit", "clean": "rm -rf dist" },
  "dependencies": {
    "@repo/feature-auth": "workspace:*",
    "@repo/feature-dashboard": "workspace:*",
    "@repo/feature-cad": "workspace:*",
    "@repo/feature-settings": "workspace:*",
    "@repo/design-system": "workspace:*",
    "@repo/types": "workspace:*",
    "react": "^18.3.0"
  }
}
```

- [ ] **Step 2: Create src/index.ts**

```ts
import { lazy, type ComponentType } from "react";

const LazyDashboard = lazy(() =>
  import("@repo/feature-dashboard").then((m) => ({ default: m.DashboardPage as ComponentType })),
);
const LazySettings = lazy(() =>
  import("@repo/feature-settings").then((m) => ({ default: m.SettingsPage as ComponentType })),
);

export const registry: Record<string, ComponentType> = {
  dashboard: LazyDashboard,
  settings: LazySettings,
};

export function getComponent(type: string): ComponentType | undefined {
  return registry[type];
}
```

- [ ] **Step 3: Commit**

```bash
pnpm install
git add packages/registry
git commit -m "feat: add registry with lazy-loaded feature mapping"
```

---

### Task 20: Create packages/observability

**Files:**

- Create: `packages/observability/package.json`
- Create: `packages/observability/tsconfig.json`
- Create: `packages/observability/src/logger.ts`
- Create: `packages/observability/src/metrics.ts`
- Create: `packages/observability/src/index.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@repo/observability",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": { "type-check": "tsc --noEmit", "clean": "rm -rf dist" },
  "dependencies": {
    "@repo/config": "workspace:*",
    "@repo/types": "workspace:*",
    "@repo/utils": "workspace:*"
  }
}
```

- [ ] **Step 2: Create src/logger.ts**

```ts
type LogLevel = "debug" | "info" | "warn" | "error";

const SENSITIVE_KEYS = ["password", "token", "secret", "authorization", "cookie"];

function redact(obj: unknown): unknown {
  if (typeof obj !== "object" || obj === null) return obj;
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k))) {
      result[key] = "[REDACTED]";
    } else {
      result[key] = redact(value);
    }
  }
  return result;
}

function log(level: LogLevel, message: string, data?: unknown) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(data ? { data: redact(data) } : {}),
  };
  console[level === "debug" ? "log" : level](
    `[${entry.level.toUpperCase()}] ${entry.message}`,
    data ? entry.data : "",
  );
}

export const logger = {
  debug: (msg: string, data?: unknown) => log("debug", msg, data),
  info: (msg: string, data?: unknown) => log("info", msg, data),
  warn: (msg: string, data?: unknown) => log("warn", msg, data),
  error: (msg: string, data?: unknown) => log("error", msg, data),
};
```

- [ ] **Step 3: Create src/metrics.ts**

```ts
const counters = new Map<string, number>();

export const metrics = {
  increment(name: string, amount = 1) {
    counters.set(name, (counters.get(name) ?? 0) + amount);
  },
  get(name: string): number {
    return counters.get(name) ?? 0;
  },
  getAll(): Record<string, number> {
    return Object.fromEntries(counters);
  },
};
```

- [ ] **Step 4: Create src/index.ts**

```ts
export { logger } from "./logger";
export { metrics } from "./metrics";
```

- [ ] **Step 5: Commit**

```bash
pnpm install
git add packages/observability
git commit -m "feat: add observability with secure logger and metrics"
```

---

## Phase 10: Apps

### Task 21: Create apps/cadvisor (main web app)

**Files:**

- Create: `apps/cadvisor/package.json`
- Create: `apps/cadvisor/tsconfig.json`
- Create: `apps/cadvisor/vite.config.ts`
- Create: `apps/cadvisor/tailwind.config.ts`
- Create: `apps/cadvisor/postcss.config.js`
- Create: `apps/cadvisor/index.html`
- Create: `apps/cadvisor/src/globals.css`
- Create: `apps/cadvisor/src/main.tsx`
- Create: `apps/cadvisor/src/app/app.tsx`
- Create: `apps/cadvisor/src/app/layout.tsx`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@repo/cadvisor",
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
    "@repo/config": "workspace:*",
    "@repo/design-system": "workspace:*",
    "@repo/feature-auth": "workspace:*",
    "@repo/feature-dashboard": "workspace:*",
    "@repo/feature-cad": "workspace:*",
    "@repo/feature-settings": "workspace:*",
    "@repo/observability": "workspace:*",
    "@repo/registry": "workspace:*",
    "@repo/services": "workspace:*",
    "@repo/store": "workspace:*",
    "@repo/tokens": "workspace:*",
    "@repo/types": "workspace:*",
    "@repo/utils": "workspace:*",
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

- [ ] **Step 2: Create config files**

`tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

`vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
});
```

`tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";
import { tailwindPreset } from "@repo/tokens";

const config: Config = {
  presets: [tailwindPreset as Config],
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/design-system/src/**/*.{ts,tsx}",
    "../../packages/features/*/src/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: { extend: {} },
  plugins: [],
};
export default config;
```

`postcss.config.js`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 3: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CadVisor</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Create src/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 5: Create src/main.tsx**

```tsx
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

- [ ] **Step 6: Create src/app/layout.tsx**

```tsx
import { type ReactNode } from "react";
import { Flex, Box, H3, Button } from "@repo/design-system";
import { useLayoutStore } from "@repo/store";
import { executeCommand } from "@repo/core";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const sidebarOpen = useLayoutStore((s) => s.sidebarOpen);

  return (
    <div className="flex h-screen">
      {sidebarOpen && (
        <aside className="w-64 border-r border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <H3 className="mb-6">CadVisor</H3>
          <nav className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => executeCommand("panel.open", { type: "dashboard" })}
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => executeCommand("panel.open", { type: "cad" })}
            >
              Projects
            </Button>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => executeCommand("panel.open", { type: "settings" })}
            >
              Settings
            </Button>
          </nav>
        </aside>
      )}
      <Box as="main" className="flex-1 overflow-auto">
        {children}
      </Box>
    </div>
  );
}
```

- [ ] **Step 7: Create src/app/app.tsx**

```tsx
import { AuthGuard } from "@repo/feature-auth";
import { DashboardPage } from "@repo/feature-dashboard";
import { Layout } from "./layout";

export function App() {
  return (
    <AuthGuard>
      <Layout>
        <DashboardPage />
      </Layout>
    </AuthGuard>
  );
}
```

- [ ] **Step 8: Install, verify, commit**

```bash
pnpm install
pnpm --filter @repo/cadvisor dev
```

Expected: App starts on http://localhost:3000, shows login form (no API backend yet, so auth will show loading/error — that's expected for scaffold).

```bash
git add apps/cadvisor
git commit -m "feat: add cadvisor web app with layout, auth guard, dashboard"
```

---

### Task 22: Create apps/cadvisor-admin

Follow same structure as cadvisor but with admin-specific layout. Key differences:

- [ ] **Step 1: Create package.json** — name: `@repo/cadvisor-admin`, port: 3001
- [ ] **Step 2: Create all config files** — same as cadvisor (tsconfig, vite, tailwind, postcss)
- [ ] **Step 3: Create index.html, globals.css, main.tsx** — same PlatformProvider + ThemeProvider wrapper
- [ ] **Step 4: Create app.tsx** — admin layout with user management focus
- [ ] **Step 5: Commit**

```bash
git commit -m "feat: add cadvisor-admin web app"
```

---

### Task 23: Create apps/desktop (Tauri shell — scaffold only)

- [ ] **Step 1: Create package.json** — same dependencies as cadvisor, name: `@repo/desktop`
- [ ] **Step 2: Create Vite + Tailwind + React files** — same as cadvisor
- [ ] **Step 3: Create src/main.tsx** — same PlatformProvider wrapper (services auto-detect Tauri)
- [ ] **Step 4: Create placeholder src-tauri/** — `tauri.conf.json` and `src/main.rs` with minimal config
- [ ] **Step 5: Commit**

```bash
git commit -m "feat: add desktop app scaffold (Tauri)"
```

---

### Task 24: Add Turborepo generator for new apps

**Files:**

- Create: `turbo/generators/config.ts`

- [ ] **Step 1: Create turbo/generators/config.ts**

```ts
import type { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("app", {
    description: "Create a new app in the monorepo",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "App name (e.g. my-app):",
      },
      {
        type: "list",
        name: "type",
        message: "App type:",
        choices: ["web", "desktop"],
      },
    ],
    actions: (data) => {
      const actions: PlopTypes.ActionType[] = [
        {
          type: "addMany",
          destination: "apps/{{name}}",
          templateFiles: "templates/app/**/*",
          base: "templates/app",
          data,
        },
      ];
      return actions;
    },
  });
}
```

- [ ] **Step 2: Add usage note to root package.json scripts**

Add to scripts:

```json
"gen:app": "turbo gen workspace"
```

- [ ] **Step 3: Commit**

```bash
git add turbo/generators
git commit -m "feat: add turborepo generator for new apps"
```

---

### Task 25: Final verification

- [ ] **Step 1: Run full install**

```bash
pnpm install
```

Expected: Clean install, no errors.

- [ ] **Step 2: Run type-check**

```bash
pnpm type-check
```

Expected: Zero TypeScript errors across all packages.

- [ ] **Step 3: Run build**

```bash
pnpm build
```

Expected: All packages build in correct dependency order.

- [ ] **Step 4: Run dev server**

```bash
pnpm --filter @repo/cadvisor dev
```

Expected: App runs at localhost:3000.

- [ ] **Step 5: Verify no component exceeds 300 lines**

```bash
find packages -name "*.tsx" | xargs wc -l | sort -rn | head -20
```

Expected: All files under 300 lines.

- [ ] **Step 6: Final commit**

```bash
git add .
git commit -m "feat: complete monorepo scaffold — all packages, features, and apps wired"
```
