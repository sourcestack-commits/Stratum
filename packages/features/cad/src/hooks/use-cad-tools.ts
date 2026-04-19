import { useCadStore } from "@repo/store";
import type { CadTool } from "@repo/types";
import { executeCommand } from "@repo/core";

export function useCadTools() {
  const selectedTool = useCadStore((s) => s.selectedTool);
  const zoomLevel = useCadStore((s) => s.zoomLevel);
  const setTool = useCadStore((s) => s.setTool);
  const setZoom = useCadStore((s) => s.setZoom);

  function handleSelectTool(tool: CadTool) {
    setTool(tool);
    executeCommand("cad.select-tool", { tool });
  }

  function handleZoom(level: number) {
    setZoom(level);
    executeCommand("cad.zoom", { level });
  }

  return { selectedTool, zoomLevel, handleSelectTool, handleZoom };
}
