import { lazy, type ComponentType } from "react";

const LazyDashboard = lazy(() =>
  import("@repo/feature-dashboard").then((m) => ({ default: m.DashboardPage as ComponentType })),
);
const LazySettings = lazy(() =>
  import("@repo/feature-settings").then((m) => ({ default: m.SettingsPage as ComponentType })),
);

export const registry: Record<string, ComponentType> = {
  dashboard: LazyDashboard,
  settings: LazySettings,
};

export function getComponent(type: string): ComponentType | undefined {
  return registry[type];
}
