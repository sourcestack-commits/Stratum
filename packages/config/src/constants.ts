// ─── App Defaults ─────────────────────────────────────────

export const APP_DEFAULTS = {
  name: "CadVisor",
  env: "local",
  logLevel: "debug",
  apiBaseUrl: "http://localhost:3001",
  themeStorageKey: "cadvisor-theme",
  defaultTheme: "system",
  defaultLanguage: "en",
} as const;

// ─── Query Configuration ─────────────────────────────────

export const QUERY_CONFIG = {
  staleTimeMs: 5 * 60 * 1000, // 5 minutes
  retryCount: 2,
  refetchOnWindowFocus: false,
} as const;

// ─── CAD Configuration ───────────────────────────────────

export const CAD_CONFIG = {
  defaultTool: "select",
  defaultZoom: 100,
  minZoom: 10,
  maxZoom: 500,
  panelWidth: "w-64",
} as const;

// ─── Layout Configuration ────────────────────────────────

export const LAYOUT_CONFIG = {
  sidebarWidth: "w-64",
  sidebarDefaultOpen: true,
  maxContentWidth: "max-w-2xl",
} as const;

// ─── Dashboard Configuration ─────────────────────────────

export const DASHBOARD_CONFIG = {
  recentActivityLimit: 5,
  statsGridColumns: 4,
  contentGridColumns: 2,
} as const;

// ─── Date Formatting Thresholds ──────────────────────────

export const TIME_THRESHOLDS = {
  justNowSeconds: 60,
  minutesInHour: 60,
  hoursInDay: 24,
  daysInMonth: 30,
} as const;

// ─── Logger Configuration ────────────────────────────────

export const LOGGER_CONFIG = {
  sensitiveKeys: ["password", "token", "secret", "authorization", "cookie"],
} as const;
