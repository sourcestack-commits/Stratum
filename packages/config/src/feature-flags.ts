import type { FeatureFlags } from "./types";

const defaultFlags: FeatureFlags = {
  enableCad: true,
  enableDashboard: true,
  enableBilling: false,
};

export function getFeatureFlags(): FeatureFlags {
  return { ...defaultFlags };
}

export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  return getFeatureFlags()[flag];
}
