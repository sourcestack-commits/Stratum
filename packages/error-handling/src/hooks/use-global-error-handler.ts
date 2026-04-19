import { useEffect } from "react";
import type { GlobalErrorHandlerOptions } from "../types";

type ErrorEventData = { error: Error; context?: string };

// Direct event listener — does not depend on @repo/core to avoid circular deps
const errorListeners = new Set<(data: ErrorEventData) => void>();

export function emitGlobalError(error: Error, context?: string): void {
  const data: ErrorEventData = { error, context };
  if (import.meta.env.DEV) {
    console.error(`[ERROR] [${context ?? "unknown"}]`, error.message);
  }
  errorListeners.forEach((fn) => fn(data));
}

export function useGlobalErrorHandler({ onError }: GlobalErrorHandlerOptions = {}) {
  useEffect(() => {
    const handler = (data: ErrorEventData) => {
      onError?.(data.error, data.context);
    };
    errorListeners.add(handler);
    return () => {
      errorListeners.delete(handler);
    };
  }, [onError]);
}
