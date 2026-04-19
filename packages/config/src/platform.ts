import type { Platform } from "./types";

export function detectPlatform(): Platform {
  if (typeof window !== "undefined" && "__TAURI_INTERNALS__" in window) {
    return "tauri";
  }
  return "web";
}

export function isTauri(): boolean {
  return detectPlatform() === "tauri";
}

export function isWeb(): boolean {
  return detectPlatform() === "web";
}
