import type { EventMap } from "@repo/types";

type Listener<K extends keyof EventMap> = EventMap[K] extends void
  ? () => void
  : (data: EventMap[K]) => void;

type AnyListener = (data?: unknown) => void;

const listeners = new Map<string, Set<AnyListener>>();

export function emit<K extends keyof EventMap>(
  ...args: EventMap[K] extends void ? [K] : [K, EventMap[K]]
): void {
  const [event, data] = args;
  if (import.meta.env.DEV) {
    console.log("[EVENT]", event, data);
  }
  listeners.get(event)?.forEach((fn) => fn(data));
}

export function on<K extends keyof EventMap>(event: K, handler: Listener<K>): () => void {
  if (!listeners.has(event)) {
    listeners.set(event, new Set());
  }
  listeners.get(event)!.add(handler as AnyListener);
  return () => {
    listeners.get(event)?.delete(handler as AnyListener);
  };
}
