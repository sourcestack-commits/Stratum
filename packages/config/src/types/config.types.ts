export type AppEnv = "local" | "demo" | "production";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface FeatureFlags {
  enableCad: boolean;
  enableDashboard: boolean;
  enableBilling: boolean;
}

export type Platform = "web" | "tauri";
