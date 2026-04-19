import { create } from "zustand";
import type { SettingsState } from "./types";
import { APP_DEFAULTS } from "@repo/config";

export const useSettingsStore = create<SettingsState>((set) => ({
  language: APP_DEFAULTS.defaultLanguage,
  notificationsEnabled: true,
  autoSave: true,
  setLanguage: (language) => set({ language }),
  setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
  setAutoSave: (autoSave) => set({ autoSave }),
}));
