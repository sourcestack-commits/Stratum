import { Card, CardContent, CardHeader, CardTitle, Text } from "@repo/design-system";
import { CAD_CONFIG } from "@repo/config";

export function CadPropertiesPanel() {
  return (
    <Card className={CAD_CONFIG.panelWidth}>
      <CardHeader>
        <CardTitle className="text-sm">Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <Text size="sm" variant="muted">
          Select an element to view properties
        </Text>
      </CardContent>
    </Card>
  );
}
