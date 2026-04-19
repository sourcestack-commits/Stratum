import { useEffect } from "react";
import type { EventMap } from "@repo/types";
import type { EventHandler } from "../types";
import { on } from "../events";

export function useEvent<K extends keyof EventMap>(event: K, handler: EventHandler<K>): void {
  useEffect(() => {
    const unsub = on(event, handler);
    return unsub;
  }, [event, handler]);
}
