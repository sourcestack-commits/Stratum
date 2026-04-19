import type { CadTool } from "@repo/types";

export interface PanelEntry {
  type: string;
  props?: Record<string, unknown>;
}

export interface LayoutState {
  sidebarOpen: boolean;
  theme: "light" | "dark" | "system";
  activePanels: PanelEntry[];
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  openPanel: (type: string, props?: Record<string, unknown>) => void;
  closePanel: (type: string) => void;
}

export interface AuthState {
  isLoginModalOpen: boolean;
  redirectAfterLogin: string | null;
  openLoginModal: (redirect?: string) => void;
  closeLoginModal: () => void;
}

export interface CadState {
  selectedTool: CadTool;
  zoomLevel: number;
  activeLayerId: string | null;
  isPanelVisible: boolean;
  setTool: (tool: CadTool) => void;
  setZoom: (level: number) => void;
  setActiveLayer: (id: string | null) => void;
  togglePanel: () => void;
}

export interface SettingsState {
  language: string;
  notificationsEnabled: boolean;
  autoSave: boolean;
  setLanguage: (lang: string) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setAutoSave: (enabled: boolean) => void;
}
