import { Card, CardContent, CardHeader, CardTitle, Text, Button, Flex } from "@repo/design-system";
import { useSettings } from "../hooks/use-settings";

export function NotificationSection() {
  const { notificationsEnabled, autoSave, setNotificationsEnabled, setAutoSave } = useSettings();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <Flex direction="col" gap="sm">
          <Flex justify="between" align="center">
            <Text size="sm">Notifications</Text>
            <Button
              variant={notificationsEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              {notificationsEnabled ? "On" : "Off"}
            </Button>
          </Flex>
          <Flex justify="between" align="center">
            <Text size="sm">Auto-save</Text>
            <Button
              variant={autoSave ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoSave(!autoSave)}
            >
              {autoSave ? "On" : "Off"}
            </Button>
          </Flex>
        </Flex>
      </CardContent>
    </Card>
  );
}
