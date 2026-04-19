# Agent: Architecture Validator

Scan the entire codebase for architecture violations, hardcoded values, and standard deviations.

## Purpose

This agent runs a full audit of the monorepo against all rules defined in CLAUDE.md. It catches issues that accumulate over time — things individual reviews might miss.

## When to Run

- After a large feature is completed
- Before a release
- Weekly as a health check
- When onboarding to verify nothing has drifted

## Checks to Perform

### Check 1: Dependency Direction Violations

Scan every import statement in every .ts/.tsx file. For each file, determine which package it belongs to, then verify every import follows the allowed dependencies.

```
Allowed:
  apps       → everything
  features   → design-system, store, core, services, error-handling, config, types, utils
  design-system → tokens, types, utils
  store      → core, config, types, utils
  core       → services, observability, config, types, utils
  services   → config, types, utils
  error-handling → types, utils, observability
  registry   → features, design-system, types
  observability → config, types, utils
  tokens     → types
  config     → types, utils
  utils      → types
  types      → nothing
```

Search pattern:

```bash
grep -rn "from \"@repo/" packages/ --include="*.ts" --include="*.tsx"
```

Flag any import that violates the rules.

### Check 2: File Size Violations

```bash
find packages apps -name "*.tsx" -o -name "*.ts" | xargs wc -l | sort -rn
```

Flag any file over 300 lines.

### Check 3: Hardcoded Values

Search for patterns:

```bash
grep -rn "http://localhost" packages/ apps/*/src/ --include="*.ts" --include="*.tsx"
grep -rn '"CadVisor' packages/ apps/*/src/ --include="*.ts" --include="*.tsx"
grep -rn "dark:bg-neutral-950" packages/design-system/ packages/error-handling/ --include="*.tsx"
```

Skip: .env files, constants.ts, mock-api data files, CLAUDE.md, docs/.

### Check 4: Inline Interfaces

```bash
grep -rn "^export interface\|^interface " packages/*/src/*.ts packages/*/src/*.tsx packages/*/src/**/*.ts packages/*/src/**/*.tsx
```

Flag any interface found outside of a `types/` directory. Exception: CVA VariantProps in design-system components.

### Check 5: Store Selector Violations

```bash
grep -rn "useLayoutStore()\|useCadStore()\|useAuthStore()\|useSettingsStore()" packages/ apps/ --include="*.ts" --include="*.tsx"
```

Flag any store usage without a selector.

### Check 6: Error Import Violations

```bash
grep -rn "ErrorView.*from.*design-system\|ErrorBoundary.*from.*design-system\|useGlobalError.*from.*core" packages/ apps/ --include="*.ts" --include="*.tsx"
```

Flag any error imports from wrong packages. Must be from `@repo/error-handling`.

### Check 7: Raw Error Messages

```bash
grep -rn "error\.message" packages/features/ apps/ --include="*.tsx"
```

Flag any `error.message` displayed in JSX without `resolveHttpError()`.

### Check 8: Missing Exports

For each package, verify that every public component/hook/type is exported from the package's `src/index.ts`.

### Check 9: Missing Test Files

List packages that have implementation but no `.test.ts` files:

```bash
for dir in packages/*/src; do
  ts_count=$(find "$dir" -name "*.ts" -not -name "*.test.ts" -not -name "*.stories.tsx" -not -name "index.ts" | wc -l)
  test_count=$(find "$dir" -name "*.test.ts" | wc -l)
  echo "$dir: $ts_count source files, $test_count test files"
done
```

### Check 10: Package.json Dependency Consistency

For each package, verify its `package.json` dependencies match what it actually imports.

## Output Format

```
ARCHITECTURE AUDIT REPORT
=========================
Date: YYYY-MM-DD
Packages scanned: X
Files scanned: X

DEPENDENCY VIOLATIONS: X
  [file] imports [package] — not allowed from [current-package]

FILE SIZE VIOLATIONS: X
  [file] — X lines (max 300)

HARDCODED VALUES: X
  [file:line] — description

INLINE INTERFACES: X
  [file:line] — interface name

STORE SELECTOR VIOLATIONS: X
  [file:line] — useStore() without selector

ERROR IMPORT VIOLATIONS: X
  [file:line] — wrong import source

RAW ERROR MESSAGES: X
  [file:line] — error.message in JSX

MISSING EXPORTS: X
  [package] — [component] not exported from index.ts

MISSING TESTS: X
  [package] — X source files, 0 tests

DEPENDENCY ISSUES: X
  [package] — imports [dep] but not in package.json

TOTAL ISSUES: X
HEALTH SCORE: X/100
```
