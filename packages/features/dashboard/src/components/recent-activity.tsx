import { Card, CardContent, CardHeader, CardTitle, Text, Stack, Loader } from "@repo/design-system";
import { ErrorView } from "@repo/error-handling";
import { formatRelativeTime } from "@repo/utils";
import { DASHBOARD_CONFIG } from "@repo/config";
import { useRecentActivity } from "../hooks/use-recent-activity";

export function RecentActivity() {
  const { data, isLoading, error, refetch } = useRecentActivity(
    DASHBOARD_CONFIG.recentActivityLimit,
  );
  if (isLoading) return <Loader />;
  if (error) return <ErrorView message={error.message} onRetry={() => refetch()} />;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap="sm">
          {data?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800 last:border-0"
            >
              <Text size="sm">{item.description}</Text>
              <Text variant="muted" size="xs">
                {formatRelativeTime(item.timestamp)}
              </Text>
            </div>
          ))}
          {data?.length === 0 && (
            <Text variant="muted" size="sm">
              No recent activity
            </Text>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
