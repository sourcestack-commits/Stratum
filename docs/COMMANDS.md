# All Commands — CadVisor Monorepo

## Development

| Command                                  | What It Does                       |
| ---------------------------------------- | ---------------------------------- |
| `pnpm dev`                               | Start all apps (local env)         |
| `pnpm dev:demo`                          | Start all apps (demo env)          |
| `pnpm dev:prod`                          | Start all apps (production env)    |
| `pnpm dev --filter @repo/cadvisor`       | Start main app only (port 3000)    |
| `pnpm dev --filter @repo/cadvisor-admin` | Start admin app only (port 3001)   |
| `pnpm dev --filter @repo/desktop`        | Start desktop app only (port 3002) |
| `pnpm storybook`                         | Start Storybook (port 6006)        |

## Mock API (MSW)

Mock API starts **automatically** in dev mode. No separate command needed.

| What           | How                                                         |
| -------------- | ----------------------------------------------------------- |
| Start mock API | Runs automatically with `pnpm dev`                          |
| Where it lives | `packages/mock-api/`                                        |
| How it works   | MSW intercepts fetch requests in the browser                |
| Production     | Disabled — MSW only runs when `import.meta.env.DEV` is true |

### Test Credentials

| Role   | Email                 | Password    |
| ------ | --------------------- | ----------- |
| Admin  | `admin@cadvisor.com`  | `admin123`  |
| User   | `user@cadvisor.com`   | `user123`   |
| Viewer | `viewer@cadvisor.com` | `viewer123` |

### Mock Data Available

| Endpoint                          | What It Returns                              |
| --------------------------------- | -------------------------------------------- |
| `POST /auth/login`                | Auth session (validates credentials)         |
| `POST /auth/signup`               | New auth session                             |
| `POST /auth/logout`               | Clears session                               |
| `GET /auth/session`               | Current session or 401                       |
| `GET /dashboard/stats`            | 24 projects, 8 active, 156 users, 43 updates |
| `GET /dashboard/activity?limit=5` | 5 recent activity items                      |
| `GET /cad/projects`               | 2 sample CAD projects                        |
| `GET /cad/projects/:id`           | Single project with layers                   |
| `GET /user/profile`               | Current user profile                         |
| `PATCH /user/profile`             | Update profile                               |

### Adding New Mock Endpoints

```
1. Add mock data:     packages/mock-api/src/data/my-data.ts
2. Add handler:       packages/mock-api/src/handlers/my.handlers.ts
3. Export from:       packages/mock-api/src/handlers/index.ts
4. Register in:       packages/mock-api/src/browser.ts
```

## Build

| Command                                   | What It Does                         |
| ----------------------------------------- | ------------------------------------ |
| `pnpm build`                              | Build all (local env)                |
| `pnpm build:demo`                         | Build all (demo env)                 |
| `pnpm build:prod`                         | Build all (production env)           |
| `pnpm build --filter @repo/cadvisor`      | Build main app only                  |
| `pnpm build --filter @repo/design-system` | Build design-system only             |
| `pnpm build-storybook`                    | Build Storybook for deployment       |
| `pnpm clean`                              | Delete all dist/ and .turbo/ folders |

## Environments

Each app has its own env files in `apps/{name}/environment/`:

| File                 | When It's Used                      | Committed to Git |
| -------------------- | ----------------------------------- | ---------------- |
| `.env.local`         | `pnpm dev` / `pnpm build`           | No (gitignored)  |
| `.env.demo`          | `pnpm dev:demo` / `pnpm build:demo` | Yes              |
| `.env.prod`          | `pnpm dev:prod` / `pnpm build:prod` | Yes              |
| `.env.local.example` | Template — copy to `.env.local`     | Yes              |

### Setup Local Environment

```bash
# Copy the example for each app
cp apps/cadvisor/environment/.env.local.example apps/cadvisor/environment/.env.local
cp apps/cadvisor-admin/environment/.env.local.example apps/cadvisor-admin/environment/.env.local
cp apps/desktop/environment/.env.local.example apps/desktop/environment/.env.local
```

### Read Environment in Code

```ts
import { getAppEnv, getApiBaseUrl, isProduction, getLogLevel } from "@repo/config";

getAppEnv(); // "local" | "demo" | "production"
getApiBaseUrl(); // reads VITE_API_BASE_URL from current env
isProduction(); // true if VITE_APP_ENV=production
getLogLevel(); // "debug" | "info" | "warn" | "error"
```

## Quality Checks

| Command              | What It Does                         |
| -------------------- | ------------------------------------ |
| `pnpm type-check`    | TypeScript check all packages        |
| `pnpm lint`          | ESLint all packages                  |
| `pnpm format`        | Format all files with Prettier       |
| `pnpm format:check`  | Check formatting without fixing (CI) |
| `pnpm test`          | Run all tests                        |
| `pnpm test:watch`    | Run tests in watch mode              |
| `pnpm test:coverage` | Run tests with coverage report       |

## Security

| Command               | What It Does                                               |
| --------------------- | ---------------------------------------------------------- |
| `pnpm audit:security` | Check for vulnerable dependencies (fails on high severity) |
| `pnpm audit`          | Full security audit                                        |

## Generators — Create New Things

| Command              | What It Creates                        |
| -------------------- | -------------------------------------- |
| `pnpm gen:app`       | New app in `apps/`                     |
| `pnpm gen:package`   | New package in `packages/`             |
| `pnpm gen:feature`   | New feature in `packages/features/`    |
| `pnpm gen:component` | New component + story in design-system |

### Generator Details

**`pnpm gen:app`**

```
? App name: my-app
? App type: web / desktop

Creates: apps/my-app/
  ├── package.json, tsconfig.json
  ├── vite.config.ts, tailwind.config.ts, postcss.config.js
  ├── index.html
  └── src/ (main.tsx with PlatformProvider, app.tsx)

After: pnpm install
```

**`pnpm gen:package`**

```
? Package name: analytics
? Package type: Basic / React / Store

Creates: packages/analytics/
  ├── package.json (deps based on type)
  ├── tsconfig.json
  └── src/index.ts

After: pnpm install
```

**`pnpm gen:feature`**

```
? Feature name: billing

Creates: packages/features/billing/
  ├── package.json (all feature deps wired)
  ├── tsconfig.json
  └── src/
      ├── components/billing-page.tsx
      ├── hooks/use-billing.ts
      └── index.ts

After: pnpm install
```

**`pnpm gen:component`**

```
? Component name: badge
? Component category: Component / Primitive / Typography

Creates:
  packages/design-system/src/components/badge.tsx
  packages/design-system/src/components/badge.stories.tsx

After: Add export to design-system/src/components/index.ts
```

## Package-Specific Commands

| Command                                   | What It Does                       |
| ----------------------------------------- | ---------------------------------- |
| `pnpm --filter @repo/{name} type-check`   | Type-check one package             |
| `pnpm --filter @repo/{name} build`        | Build one package                  |
| `pnpm --filter @repo/{name} add {dep}`    | Add dependency to one package      |
| `pnpm --filter @repo/{name} add -D {dep}` | Add dev dependency to one package  |
| `pnpm --filter @repo/{name} remove {dep}` | Remove dependency from one package |

### Filter Examples

```bash
# Type-check only the store package
pnpm --filter @repo/store type-check

# Add a dependency to feature-auth
pnpm --filter @repo/feature-auth add zod

# Add a dev dependency to design-system
pnpm --filter @repo/design-system add -D @types/react

# Remove a dependency from utils
pnpm --filter @repo/utils remove lodash
```

## Dependency Management

| Command                             | What It Does                    |
| ----------------------------------- | ------------------------------- |
| `pnpm install`                      | Install all dependencies        |
| `pnpm add -wD {package}`            | Add root dev dependency         |
| `pnpm add -w {package}`             | Add root dependency             |
| `pnpm why @repo/{name} --recursive` | Show who depends on a package   |
| `pnpm ls --depth 0 -r`              | List all workspace packages     |
| `pnpm outdated -r`                  | Check for outdated dependencies |
| `pnpm update -r`                    | Update all dependencies         |

## Delete a Package

```bash
# 1. Check who depends on it
pnpm why @repo/{name} --recursive

# 2. If output is empty → safe to delete
#    If output shows dependents → remove from their package.json first

# 3. Delete the folder
rm -rf packages/{name}

# 4. Reinstall
pnpm install

# 5. Verify
pnpm type-check
```

## Delete a Feature

```bash
# 1. Check dependents
pnpm why @repo/feature-{name} --recursive

# 2. Remove from: registry (packages/registry/src/index.ts)
#    Remove from: app routes (apps/*/src/app/app.tsx)
#    Remove from: app package.json dependencies

# 3. Delete folder
rm -rf packages/features/{name}

# 4. Reinstall and verify
pnpm install && pnpm type-check
```

## Delete an App

```bash
# 1. Delete folder
rm -rf apps/{name}

# 2. Reinstall
pnpm install
```

## Git Hooks (Automatic)

These run automatically — you don't call them:

| Hook         | When               | What It Does                    |
| ------------ | ------------------ | ------------------------------- |
| `pre-commit` | Every `git commit` | Formats + lints staged files    |
| `commit-msg` | Every `git commit` | Validates commit message format |

### Commit Message Format

```bash
# Valid formats:
git commit -m "feat: add billing feature"
git commit -m "fix: resolve login redirect bug"
git commit -m "docs: update developer guide"
git commit -m "refactor: simplify auth hook"
git commit -m "test: add store tests"
git commit -m "chore: update dependencies"
git commit -m "style: format button component"
git commit -m "perf: optimize dashboard queries"
git commit -m "ci: add build caching"

# Invalid (will be rejected):
git commit -m "updated stuff"          # no type prefix
git commit -m "Feature: add billing"   # wrong case
```

## Turborepo Cache

| Command           | What It Does                        |
| ----------------- | ----------------------------------- |
| `npx turbo login` | Authenticate with Vercel (one-time) |
| `npx turbo link`  | Connect to remote cache (one-time)  |

After linking, builds are cached in the cloud. Teammates reuse your cached builds.

## Full Workflow Example

```bash
# 1. Create a new feature
pnpm gen:feature
# → name: billing

# 2. Install dependencies
pnpm install

# 3. Develop
pnpm dev --filter @repo/cadvisor

# 4. Add a component to design-system
pnpm gen:component
# → name: price-card, category: Component

# 5. Preview in Storybook
pnpm storybook

# 6. Check everything
pnpm type-check
pnpm lint
pnpm test

# 7. Commit
git add .
git commit -m "feat: add billing feature with price card"

# 8. Build for production
pnpm build
```
