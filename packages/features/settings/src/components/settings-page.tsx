import { Stack, H1, Text } from "@repo/design-system";
import { ProfileSection } from "./profile-section";
import { AppearanceSection } from "./appearance-section";
import { NotificationSection } from "./notification-section";

export function SettingsPage() {
  return (
    <Stack gap="lg" className="p-6 max-w-2xl">
      <Stack gap="xs">
        <H1>Settings</H1>
        <Text variant="muted">Manage your account and preferences</Text>
      </Stack>
      <ProfileSection />
      <AppearanceSection />
      <NotificationSection />
    </Stack>
  );
}
