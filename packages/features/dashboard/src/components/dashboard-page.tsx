import { Stack, Grid, H1, Text, Loader } from "@repo/design-system";
import { ErrorView } from "@repo/error-handling";
import { DASHBOARD_CONFIG } from "@repo/config";
import { useDashboardStats } from "../hooks/use-dashboard-stats";
import { StatCard } from "./stat-card";
import { RecentActivity } from "./recent-activity";
import { QuickActions } from "./quick-actions";

export function DashboardPage() {
  const { data: stats, isLoading, error, refetch } = useDashboardStats();
  if (isLoading)
    return (
      <div className="flex justify-center p-12">
        <Loader size="lg" />
      </div>
    );
  if (error) return <ErrorView message={error.message} onRetry={() => refetch()} />;
  return (
    <Stack gap="lg" className="p-6">
      <Stack gap="xs">
        <H1>Dashboard</H1>
        <Text variant="muted">Overview of your workspace</Text>
      </Stack>
      <Grid cols={DASHBOARD_CONFIG.statsGridColumns} gap="md">
        <StatCard title="Total Projects" value={stats?.totalProjects ?? 0} />
        <StatCard title="Active Projects" value={stats?.activeProjects ?? 0} />
        <StatCard title="Total Users" value={stats?.totalUsers ?? 0} />
        <StatCard title="Recent Updates" value={stats?.recentUpdates ?? 0} />
      </Grid>
      <Grid cols={DASHBOARD_CONFIG.contentGridColumns} gap="md">
        <RecentActivity />
        <QuickActions />
      </Grid>
    </Stack>
  );
}
