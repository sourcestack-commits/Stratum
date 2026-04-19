import type { ReactNode } from "react";
import type { EventMap } from "@repo/types";

export type EventHandler<K extends keyof EventMap> = EventMap[K] extends void
  ? () => void
  : (data: EventMap[K]) => void;

export interface PlatformProviderProps {
  children: ReactNode;
}
