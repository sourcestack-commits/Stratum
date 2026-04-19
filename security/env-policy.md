# Environment Variable Policy

## Rules

1. **Client-safe variables** must start with `VITE_`
   - These are embedded in the browser bundle
   - NEVER put secrets here

2. **Secrets** must ONLY be in:
   - Server-side environment (API backend)
   - Tauri runtime (src-tauri/)
   - CI/CD secrets (GitHub Actions)

3. **Never commit** `.env` files — only `.env.example`

## Required Variables

| Variable              | Required | Description      |
| --------------------- | -------- | ---------------- |
| VITE_API_BASE_URL     | Yes      | Backend API URL  |
| VITE_APP_NAME         | No       | App display name |
| VITE_ENABLE_CAD       | No       | Feature flag     |
| VITE_ENABLE_DASHBOARD | No       | Feature flag     |
| VITE_ENABLE_BILLING   | No       | Feature flag     |

## Tauri-Only Variables (Desktop)

These are set in `src-tauri/.env` and are NOT exposed to the browser:

| Variable       | Description               |
| -------------- | ------------------------- |
| DATABASE_URL   | Local database connection |
| ENCRYPTION_KEY | Data encryption key       |

## Validation

The `@repo/config` package validates all required variables at startup.
Missing required variables throw an error with a clear message.
