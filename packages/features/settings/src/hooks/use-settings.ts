import { useSettingsStore } from "@repo/store";

export function useSettings() {
  const language = useSettingsStore((s) => s.language);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const autoSave = useSettingsStore((s) => s.autoSave);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const setNotificationsEnabled = useSettingsStore((s) => s.setNotificationsEnabled);
  const setAutoSave = useSettingsStore((s) => s.setAutoSave);
  return {
    language,
    notificationsEnabled,
    autoSave,
    setLanguage,
    setNotificationsEnabled,
    setAutoSave,
  };
}
