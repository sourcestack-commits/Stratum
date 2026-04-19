import type { AppEnv, LogLevel } from "./types";
import { APP_DEFAULTS } from "./constants";

export function getEnv(key: string, fallback?: string): string {
  const value =
    typeof import.meta !== "undefined" && import.meta.env ? import.meta.env[key] : undefined;

  if (value !== undefined) return value;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing environment variable: ${key}`);
}

export function getAppEnv(): AppEnv {
  return getEnv("VITE_APP_ENV", APP_DEFAULTS.env) as AppEnv;
}

export function getAppName(): string {
  return getEnv("VITE_APP_NAME", APP_DEFAULTS.name);
}

export function getApiBaseUrl(): string {
  return getEnv("VITE_API_BASE_URL", APP_DEFAULTS.apiBaseUrl);
}

export function getLogLevel(): LogLevel {
  return getEnv("VITE_LOG_LEVEL", APP_DEFAULTS.logLevel) as LogLevel;
}

export function isProduction(): boolean {
  return getAppEnv() === "production";
}

export function isDemo(): boolean {
  return getAppEnv() === "demo";
}
