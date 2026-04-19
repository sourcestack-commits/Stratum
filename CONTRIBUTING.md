# Contributing to CadVisor

## Setup

1. Install [Node.js 20+](https://nodejs.org/) and [pnpm 9+](https://pnpm.io/)
2. Clone the repo and run `pnpm install`
3. Read [Developer Guide](docs/DEVELOPER-GUIDE.md) for detailed instructions

## Development Workflow

```bash
# 1. Create a branch
git checkout -b feature/my-feature

# 2. Make changes

# 3. Check your work
pnpm type-check        # No TypeScript errors
pnpm lint              # No ESLint errors
pnpm format            # Format code
pnpm test              # Tests pass

# 4. Commit (husky runs lint-staged automatically)
git commit -m "feat: add my feature"

# 5. Push and create PR
git push origin feature/my-feature
```

## Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix a bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

## Code Standards

- **300-line max** per component file — split if larger
- **Functional components only** — no class components (except ErrorBoundary)
- **Named exports** — `export function Button()` not `export default`
- **One component per file** — file name matches component name
- **Props typed at top** — `interface ButtonProps { ... }`
- **Hooks extract logic** — components only render
- **Selectors on stores** — `useStore(s => s.value)` not `useStore()`

## Adding New Code

| I want to...                  | See guide section                              |
| ----------------------------- | ---------------------------------------------- |
| Create a new package          | [Developer Guide #3](docs/DEVELOPER-GUIDE.md)  |
| Create a new feature          | [Developer Guide #4](docs/DEVELOPER-GUIDE.md)  |
| Create a new app              | [Developer Guide #5](docs/DEVELOPER-GUIDE.md)  |
| Add a design system component | [Developer Guide #6](docs/DEVELOPER-GUIDE.md)  |
| Add a Storybook story         | [Developer Guide #7](docs/DEVELOPER-GUIDE.md)  |
| Add a new store               | [Developer Guide #8](docs/DEVELOPER-GUIDE.md)  |
| Add a new service             | [Developer Guide #9](docs/DEVELOPER-GUIDE.md)  |
| Add a command or event        | [Developer Guide #10](docs/DEVELOPER-GUIDE.md) |

## Package Dependency Rules

```
apps       → everything
features   → design-system, store, core, services, config, types, utils
design-system → tokens, types, utils
store      → core, types, utils
core       → services, observability, config, types, utils
services   → config, types, utils
```

**Never**: features → features, services → store, core → features, design-system → store

## Need Help?

- Read the [Developer Guide](docs/DEVELOPER-GUIDE.md)
- Check the [Architecture Guide](docs/ARCHITECTURE.md) for the big picture
