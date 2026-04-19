<div align="center">

# Stratum

**A production-grade React monorepo with enforced architecture, multi-platform support, and batteries included.**

Build a web app, an admin panel, and a native desktop app — from one codebase, sharing 80%+ of the code, with architectural rules the linter refuses to let you break.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.x-EF4444?logo=turborepo&logoColor=white)](https://turbo.build/)
[![pnpm](https://img.shields.io/badge/pnpm-9.x-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tauri](https://img.shields.io/badge/Tauri-2.x-FFC131?logo=tauri&logoColor=black)](https://tauri.app/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Quick Start](#quick-start) · [Why Stratum](#why-stratum) · [Architecture](#architecture) · [Docs](#documentation) · [Comparison](#how-stratum-compares) · [Contributing](#contributing)

</div>

---

## Why Stratum

Most monorepo starters give you Turborepo + pnpm and stop there. You spend the next two months building the boring, high-leverage infrastructure yourself — a design system, state conventions, an error-handling strategy, generators, layer enforcement, Tauri bridging, mock APIs, observability.

**Stratum ships that infrastructure.** It's not a "hello world" starter — it's the opinionated base we use to build real products, shaped by production lessons and codified into rules the linter enforces for you.

### What you get on day one

- 🏛️ **Layer-enforced architecture** — ESLint boundaries prevent `features → features`, `services → store`, `core → features`, and other classic monorepo smells. Break the rule, fail the build.
- 🖥️ **Multi-platform from minute zero** — Web app, admin panel, and native Tauri desktop app, sharing one codebase, one design system, one service layer.
- 🎨 **Design system as a package** — shadcn/ui + Radix + Tailwind + CVA, pre-assembled. Not a folder of copy-pasted components.
- ⚡ **One-command generators** — `pnpm gen:app`, `pnpm gen:package`, `pnpm gen:feature`, `pnpm gen:component`. New surface area in seconds, wired up to the architecture automatically.
- 📡 **Typed command + event bus** — cross-feature communication without import spaghetti. TypeScript catches wrong command/event names at compile time.
- 🎯 **Platform-agnostic service layer** — one interface, two implementations (`web.ts` with `fetch`, `tauri.ts` with `invoke`). Your features never know whether they're running in a browser or a native shell.
- 🧩 **MSW mock API pre-wired** — frontend development never waits for the backend.
- 🛡️ **Error handling as a first-class package** — centralized error codes, resolved messages, global emitter, `ErrorBoundary`, `NotFoundPage`. One way to handle errors, everywhere.
- 📊 **Observability package** — logger + metrics with pluggable transports, ready for Sentry / Datadog / your choice.
- 📚 **Storybook configured** — every design system component has a story out of the box.
- 🧪 **Vitest + coverage** — unit tests co-located with source files.
- 🔒 **Husky + commitlint + Prettier + ESLint** — commits stay clean without thinking about it.

### What makes it _production-grade_

- **Strict TypeScript** everywhere — no `any` escape hatches in the core packages
- **Named exports only** — better tree-shaking, easier refactoring
- **300-line file limit** enforced — splits happen naturally
- **State model isn't a debate** — server state in TanStack Query, client state in Zustand, and a linter rule to enforce it
- **No hardcoded magic numbers** — all constants live in `@repo/config`
- **Environment management per app** — `.env.demo`, `.env.prod`, `.env.local`
- **Dark mode conventions** codified — one set of surface colors, enforced

---

## Quick Start

### Requirements

- Node.js 20+ ([nvm](https://github.com/nvm-sh/nvm) recommended)
- pnpm 9+ (`npm install -g pnpm`)
- Rust toolchain (only if building the desktop app) — [rustup.rs](https://rustup.rs)

### Clone & run

```bash
git clone https://github.com/<your-org>/stratum.git my-app
cd my-app
pnpm install
pnpm dev
```

Three apps come up:

| App          | URL                   |
| ------------ | --------------------- |
| Main web app | http://localhost:3000 |
| Admin panel  | http://localhost:3001 |
| Storybook    | http://localhost:6006 |

Desktop app: `pnpm dev --filter @repo/desktop`

### Test credentials (mock API)

```
email:    admin@example.com
password: admin123
```

---

## Architecture

### Apps

| App               | Purpose                               | Port | Tech            |
| ----------------- | ------------------------------------- | ---- | --------------- |
| `apps/demo`       | Flagship reference app (CAD platform) | 3000 | Vite + React 18 |
| `apps/demo-admin` | Admin panel                           | 3001 | Vite + React 18 |
| `apps/desktop`    | Native desktop app                    | 3002 | Tauri 2.x       |

### Packages

```
packages/
├── types/           # Shared type definitions
├── utils/           # cn, formatDate, debounce, and friends
├── config/          # Environment, feature flags, constants
├── tokens/          # Design tokens (colors, spacing, typography)
├── services/        # API layer — web (fetch) + desktop (Tauri invoke)
├── core/            # Typed commands + events, PlatformProvider
├── store/           # Zustand client state
├── design-system/   # shadcn/ui + Radix + Tailwind + CVA
├── features/
│   ├── auth/        # Login, signup, auth guard
│   ├── dashboard/   # Stats, activity, quick actions
│   ├── cad/         # Flagship feature — CAD editor
│   └── settings/    # Profile, appearance, notifications
├── registry/        # Dynamic component mapping
├── observability/   # Logger, metrics
├── error-handling/  # Centralized error codes + UI
└── mock-api/        # MSW handlers + fixtures
```

### Layer dependencies (enforced by ESLint)

```
apps              →  everything
features          →  design-system, store, core, services,
                     error-handling, config, types, utils
design-system     →  tokens, types, utils
store             →  core, config, types, utils
core              →  services, observability, config, types, utils
services          →  config, types, utils
error-handling    →  types, utils, observability
```

Forbidden dependencies (build fails):

- `features → features`
- `services → store`
- `core → features`
- `design-system → store`

### Data flow

```
                ┌───────────────────────────────────┐
                │          Apps (demo,          │
                │       demo-admin, desktop)    │
                └───────────────┬───────────────────┘
                                │
                ┌───────────────▼───────────────┐
                │          Features             │
                │ (auth, dashboard, cad, ...)   │
                └────┬──────┬──────┬──────┬─────┘
                     │      │      │      │
          ┌──────────▼─┐ ┌──▼──┐ ┌─▼───┐ ┌▼──────┐
          │ design-    │ │store│ │core │ │services│
          │ system     │ │     │ │     │ │        │
          └──────┬─────┘ └──┬──┘ └──┬──┘ └──┬─────┘
                 │          │       │       │
              ┌──▼──┐    ┌──▼─┐  ┌──▼──┐ ┌──▼──┐
              │tokens│   │core│  │serv.│ │types│
              └──────┘   └────┘  └─────┘ └─────┘
```

---

## How Stratum Compares

|                                                   | **Stratum** | create-t3-turbo | shadcn/ui monorepo | Turborepo starter | Nx React starter |
| ------------------------------------------------- | :---------: | :-------------: | :----------------: | :---------------: | :--------------: |
| Turborepo + pnpm                                  |     ✅      |       ✅        |         ✅         |        ✅         |   ❌ (uses Nx)   |
| TypeScript strict                                 |     ✅      |       ✅        |         ✅         |        ⚠️         |        ✅        |
| Tailwind + shadcn/ui                              |     ✅      |       ❌        |         ✅         |        ❌         |        ❌        |
| **Layer-enforced architecture**                   |     ✅      |       ❌        |         ❌         |        ❌         |    ⚠️ partial    |
| **Tauri desktop support**                         |     ✅      |       ❌        |         ❌         |        ❌         |        ❌        |
| Pre-built design system package                   |     ✅      |       ❌        |         ✅         |        ❌         |        ❌        |
| Pre-built features (auth, dashboard, settings)    |     ✅      |  ⚠️ auth only   |         ❌         |        ❌         |        ❌        |
| **Generators (app, package, feature, component)** |     ✅      |       ❌        |         ❌         |        ❌         |        ✅        |
| **Typed command + event bus**                     |     ✅      |       ❌        |         ❌         |        ❌         |        ❌        |
| **MSW mock API pre-wired**                        |     ✅      |       ❌        |         ❌         |        ❌         |        ❌        |
| **Error handling package**                        |     ✅      |       ❌        |         ❌         |        ❌         |        ❌        |
| **Observability package**                         |     ✅      |       ❌        |         ❌         |        ❌         |        ❌        |
| Storybook                                         |     ✅      |       ❌        |         ❌         |        ❌         |        ⚠️        |
| Platform-agnostic service layer                   |     ✅      |       ❌        |         ❌         |        ❌         |        ❌        |
| Flagship example app included                     |   ✅ CAD    |   ✅ T3 demo    |         ❌         |      ⚠️ stub      |     ⚠️ stub      |

---

## Tech Stack

| Layer                   | Pick                     |
| ----------------------- | ------------------------ |
| **Package manager**     | pnpm 9                   |
| **Build orchestration** | Turborepo 2              |
| **Bundler**             | Vite 5                   |
| **Desktop runtime**     | Tauri 2                  |
| **UI framework**        | React 18                 |
| **Language**            | TypeScript 5 (strict)    |
| **Styling**             | Tailwind + CVA           |
| **Components**          | shadcn/ui + Radix UI     |
| **Client state**        | Zustand (with selectors) |
| **Server state**        | TanStack Query           |
| **Testing**             | Vitest + Testing Library |
| **Component dev**       | Storybook 8              |
| **Linting**             | ESLint (with boundaries) |
| **Formatting**          | Prettier                 |
| **Git hooks**           | Husky + commitlint       |

---

## Commands

### Development

```bash
pnpm dev                               # Start all apps
pnpm dev --filter @repo/demo       # Start main app only
pnpm dev --filter @repo/demo-admin # Start admin only
pnpm dev --filter @repo/desktop        # Start desktop (Tauri)
pnpm storybook                         # Start Storybook
```

### Quality

```bash
pnpm type-check       # TypeScript across all packages
pnpm lint             # ESLint (enforces layer boundaries)
pnpm test             # Vitest — all tests
pnpm test:watch       # Vitest watch
pnpm test:coverage    # With coverage
pnpm format           # Prettier write
pnpm format:check     # Prettier check
```

### Build

```bash
pnpm build            # Build every app + package
pnpm clean            # Clean all build artifacts
```

### Generators

```bash
pnpm gen:app          # New app (with PlatformProvider, routing, env)
pnpm gen:package      # New package (basic / react / store templates)
pnpm gen:feature      # New feature (components, hooks, types scaffolded)
pnpm gen:component    # New design-system component + Storybook story
```

### Security

```bash
pnpm audit:security   # Dependency + SAST audit
```

---

## Code Standards (enforced)

Stratum takes strong opinions so you don't have to argue in PRs.

**Components**

- 300-line max per file
- Named exports only (no `export default`)
- One component per file
- Functional components only (except `ErrorBoundary`)
- Props interfaces live in `types/` folder (except CVA components)
- Event handlers named `handleClick`, `handleSubmit`
- Boolean props named `isOpen`, `hasError`

**State**

- Server data → TanStack Query (never copied into Zustand)
- Client data → Zustand with selectors (`useStore((s) => s.x)`, not `useStore()`)

**Error handling**

- Everything flows through `@repo/error-handling`
- Features emit errors via `emitGlobalError(err, 'feature.action')`
- UI renders via `resolveHttpError(err).message`

**Imports**

- Workspace imports use `@repo/<package>` (never relative paths across packages)

**Constants**

- Live in `@repo/config`; no magic numbers in features

Full rules: [CLAUDE.md](CLAUDE.md).

---

## Documentation

| Guide                                              | What's inside                                                             |
| -------------------------------------------------- | ------------------------------------------------------------------------- |
| [CLAUDE.md](CLAUDE.md)                             | Architectural rules, state model, conventions — canonical source of truth |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)       | The full architecture explained simply                                    |
| [docs/FEATURE-LIST.md](docs/FEATURE-LIST.md)       | All 28 features in the flagship app                                       |
| [docs/DEVELOPER-GUIDE.md](docs/DEVELOPER-GUIDE.md) | How to create packages, features, apps, components                        |
| [docs/COMMANDS.md](docs/COMMANDS.md)               | Every command with examples                                               |
| [CONTRIBUTING.md](CONTRIBUTING.md)                 | Contribution workflow                                                     |

---

## Use cases Stratum is built for

- **SaaS products with web + admin + desktop** — one team, one codebase, three surfaces
- **Agency / studio starter** — hit the ground running on client work with production defaults
- **Internal tools platforms** — layered architecture scales as more teams contribute
- **Open-source multi-platform apps** — design system + Storybook + mock API make contribution frictionless
- **Startups that plan to add a desktop or mobile surface later** — Tauri ships with the starter; the service abstraction means your features don't care which platform they run on

## When Stratum is **not** the right fit

- Building a **single static marketing site** — use Astro or plain Next.js instead
- Need **SSR/SEO-heavy product pages** — Stratum is Vite SPA-first; swap the web app for Next.js or pick a different starter
- **Solo, one-file project** — layered architecture is overhead you don't need
- **Python or Go backend monorepo** — Stratum is TypeScript-frontend-first

Honest about what it is.

---

## Roadmap

- [ ] CLI — `npx create-stratum@latest`
- [ ] Next.js app template (for SSR/SEO workloads)
- [ ] React Native app template (Expo)
- [ ] Optional Hono API app template with shared Zod schemas
- [ ] Payload CMS integration example
- [ ] pgvector + Drizzle ORM starter package
- [ ] OpenAI / Anthropic SDK integration example
- [ ] Playwright E2E test setup
- [ ] Lighthouse CI in GitHub Actions
- [ ] Renovate config
- [ ] Docker deployment recipes

Track progress in [GitHub Projects](#). Contributions welcome.

---

## Contributing

1. Fork and clone
2. `pnpm install`
3. Create a branch: `git checkout -b feat/my-feature`
4. Commit with conventional commits: `feat: add X`, `fix: resolve Y`
5. Push and open a PR

Before opening a PR:

```bash
pnpm type-check && pnpm lint && pnpm test && pnpm format:check
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.

---

## Community & support

- 🐛 **Bugs** — [Open an issue](../../issues)
- 💡 **Ideas / questions** — [Start a discussion](../../discussions)
- 📢 **Changelog** — [Releases](../../releases)

---

## Acknowledgements

Stratum stands on the shoulders of:

- [Turborepo](https://turbo.build/) — build orchestration
- [Vite](https://vitejs.dev/) — bundler
- [shadcn/ui](https://ui.shadcn.com/) — component primitives
- [Radix UI](https://www.radix-ui.com/) — accessible component foundations
- [TanStack Query](https://tanstack.com/query) — server state
- [Zustand](https://zustand-demo.pmnd.rs/) — client state
- [Tauri](https://tauri.app/) — native desktop shell
- [MSW](https://mswjs.io/) — mock API

---

## License

[MIT](LICENSE) — use it, fork it, ship with it.

---

<div align="center">

**Built with Stratum?**

Open a PR adding your project to [docs/SHOWCASE.md](docs/SHOWCASE.md) — we'll feature it.

⭐ Star this repo if Stratum saved you a week of boilerplate.

</div>
