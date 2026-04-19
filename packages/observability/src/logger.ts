import type { LogLevel } from "./types";
import { LOGGER_CONFIG } from "@repo/config";

function redact(obj: unknown): unknown {
  if (typeof obj !== "object" || obj === null) return obj;
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (LOGGER_CONFIG.sensitiveKeys.some((k) => key.toLowerCase().includes(k))) {
      result[key] = "[REDACTED]";
    } else {
      result[key] = redact(value);
    }
  }
  return result;
}

function log(level: LogLevel, message: string, data?: unknown) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(data ? { data: redact(data) } : {}),
  };
  console[level === "debug" ? "log" : level](
    `[${entry.level.toUpperCase()}] ${entry.message}`,
    data ? entry.data : "",
  );
}

export const logger = {
  debug: (msg: string, data?: unknown) => log("debug", msg, data),
  info: (msg: string, data?: unknown) => log("info", msg, data),
  warn: (msg: string, data?: unknown) => log("warn", msg, data),
  error: (msg: string, data?: unknown) => log("error", msg, data),
};
