---
paths:
  - "packages/services/**"
---

# Service Rules

- Services are the ONLY code that talks to external APIs.
- Define interfaces in `src/types/service.types.ts`.
- Two implementations: `platform/web.ts` (fetch) and `platform/tauri.ts` (invoke).
- Tauri services use dynamic import to avoid breaking web builds.
- Can only import from: `@repo/config`, `@repo/types`, `@repo/utils`.
- Never import from: store, features, design-system, core.
