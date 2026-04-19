import { Card, CardContent, CardHeader, CardTitle, Text, Stack } from "@repo/design-system";
import { useCadStore } from "@repo/store";
import { CAD_CONFIG } from "@repo/config";

export function CadLayerPanel() {
  const activeLayerId = useCadStore((s) => s.activeLayerId);
  return (
    <Card className={CAD_CONFIG.panelWidth}>
      <CardHeader>
        <CardTitle className="text-sm">Layers</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap="xs">
          <Text size="sm" variant={activeLayerId ? "default" : "muted"}>
            {activeLayerId ? `Active: ${activeLayerId}` : "No layer selected"}
          </Text>
        </Stack>
      </CardContent>
    </Card>
  );
}
