import { Box, Text } from "@repo/design-system";
import { useCadTools } from "../hooks/use-cad-tools";

export function CadCanvas() {
  const { selectedTool, zoomLevel } = useCadTools();
  return (
    <Box className="flex-1 flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 relative">
      <Text variant="muted">
        Canvas — Tool: {selectedTool} | Zoom: {zoomLevel}%
      </Text>
    </Box>
  );
}
