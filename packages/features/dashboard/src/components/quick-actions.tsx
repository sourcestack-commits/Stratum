import { Button, Card, CardContent, CardHeader, CardTitle, Flex } from "@repo/design-system";
import { executeCommand } from "@repo/core";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <Flex gap="sm" wrap="wrap">
          <Button variant="outline" onClick={() => executeCommand("panel.open", { type: "cad" })}>
            New Project
          </Button>
          <Button
            variant="outline"
            onClick={() => executeCommand("panel.open", { type: "settings" })}
          >
            Settings
          </Button>
        </Flex>
      </CardContent>
    </Card>
  );
}
