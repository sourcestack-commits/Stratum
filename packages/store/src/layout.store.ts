import { create } from "zustand";
import type { LayoutState } from "./types";

export const useLayoutStore = create<LayoutState>((set) => ({
  sidebarOpen: true,
  theme: "system",
  activePanels: [],
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  setTheme: (theme) => set({ theme }),
  openPanel: (type, props) =>
    set((s) => ({
      activePanels: [...s.activePanels.filter((p) => p.type !== type), { type, props }],
    })),
  closePanel: (type) =>
    set((s) => ({ activePanels: s.activePanels.filter((p) => p.type !== type) })),
}));
