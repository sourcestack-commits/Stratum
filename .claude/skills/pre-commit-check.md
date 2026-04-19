# Skill: /check

Run a pre-commit quality check on all staged or recently changed files.

## When to Use

Run `/check` before committing to catch issues early.

## Steps

### 1. Find Changed Files

```bash
git diff --name-only HEAD
git diff --staged --name-only
```

### 2. For Each Changed .ts/.tsx File, Verify

**File size:**

```bash
wc -l {file}
```

Must be under 300 lines. If over, list which sections to split.

**No hardcoded values:**
Search for patterns that indicate hardcoding:

- Quoted URLs: `"http://`, `"https://`
- Quoted localhost: `"localhost`
- Raw numbers in JSX: `cols={4}`, `limit={5}` (should use constants)
- Hardcoded app names: `"CadVisor"`
- Storage keys: `"cadvisor-`
- Direct color values: `"#` in TypeScript files

**Import direction:**
Check which package the file is in, verify all imports follow the dependency rules:

```
features CANNOT import from: other features, apps, registry
design-system CANNOT import from: features, store, core, services
services CANNOT import from: store, features, design-system
core CANNOT import from: features, design-system
```

**Inline interfaces:**
Search for `interface ` or `type ` definitions in implementation files (not in types/ folders).
Exception: CVA VariantProps in component files.

**Store selectors:**
Search for `useLayoutStore()`, `useCadStore()`, `useAuthStore()`, `useSettingsStore()` without selectors.
Must be: `useStore(s => s.field)` not `useStore()`.

**Error handling:**

- No `import { ErrorView } from "@repo/design-system"` (must be from `@repo/error-handling`)
- No `error.message` displayed directly to users (must use `resolveHttpError()`)
- No `import { useGlobalError } from "@repo/core"` (must be from `@repo/error-handling`)

**Dark mode:**
In design-system components, check for `dark:bg-neutral-950` (wrong for surfaces, should be `dark:bg-neutral-800`).

### 3. Run Automated Checks

```bash
pnpm type-check
pnpm lint
pnpm test
```

### 4. Report

```
PRE-COMMIT CHECK RESULTS
========================
Files checked: {count}

[PASS] File sizes — all under 300 lines
[PASS] No hardcoded values
[FAIL] packages/features/auth/src/components/login-form.tsx
       Line 15: hardcoded string "Sign In" — acceptable (UI text)
[PASS] Import directions correct
[PASS] All interfaces in types/ folders
[PASS] Store selectors used correctly
[PASS] Error handling from @repo/error-handling
[PASS] Dark mode colors consistent
[PASS] pnpm type-check
[PASS] pnpm lint
[PASS] pnpm test — 32/32 passing

RESULT: Ready to commit
```
