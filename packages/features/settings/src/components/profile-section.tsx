import { Card, CardContent, CardHeader, CardTitle, Text, Stack, Loader } from "@repo/design-system";
import { ErrorView } from "@repo/error-handling";
import { useProfile } from "../hooks/use-profile";

export function ProfileSection() {
  const { profile, isLoading, error } = useProfile();
  if (isLoading) return <Loader />;
  if (error) return <ErrorView message={error.message} />;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap="sm">
          <Text size="sm">
            <strong>Name:</strong> {profile?.name}
          </Text>
          <Text size="sm">
            <strong>Email:</strong> {profile?.email}
          </Text>
          <Text size="sm">
            <strong>Role:</strong> {profile?.role}
          </Text>
        </Stack>
      </CardContent>
    </Card>
  );
}
