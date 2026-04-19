---
paths:
  - "apps/**"
---

# App Rules

- Apps are composition roots. They assemble features, not implement logic.
- Wrap with `PlatformProvider` and `ThemeProvider` in main.tsx.
- Include `<Toaster />` in main.tsx for toast notifications.
- Wrap routes with `<GlobalErrorProvider>` from `@repo/error-handling`.
- Add `<Route path="*" element={<NotFoundPage />} />` for 404 handling.
- Use `getAppName()` from `@repo/config` for app name display, never hardcode.
- Pass `APP_DEFAULTS.defaultTheme` and `APP_DEFAULTS.themeStorageKey` to ThemeProvider.
- MSW mock API starts automatically in dev mode — no manual setup needed.
- Environment files live in `environment/` folder (.env.demo, .env.prod, .env.local).
- Sidebar navigation uses `useNavigate` + `useLocation` from react-router-dom.
