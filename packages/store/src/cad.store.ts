import { create } from "zustand";
import type { CadState } from "./types";
import { CAD_CONFIG } from "@repo/config";

export const useCadStore = create<CadState>((set) => ({
  selectedTool: CAD_CONFIG.defaultTool,
  zoomLevel: CAD_CONFIG.defaultZoom,
  activeLayerId: null,
  isPanelVisible: true,
  setTool: (tool) => set({ selectedTool: tool }),
  setZoom: (level) =>
    set({ zoomLevel: Math.max(CAD_CONFIG.minZoom, Math.min(CAD_CONFIG.maxZoom, level)) }),
  setActiveLayer: (id) => set({ activeLayerId: id }),
  togglePanel: () => set((s) => ({ isPanelVisible: !s.isPanelVisible })),
}));
