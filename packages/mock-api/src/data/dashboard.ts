import type { DashboardStats, ActivityItem } from "@repo/types";

export const MOCK_STATS: DashboardStats = {
  totalProjects: 24,
  activeProjects: 8,
  totalUsers: 156,
  recentUpdates: 43,
};

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: "act_001",
    type: "project_created",
    description: "New project 'Building A - Floor Plan' created",
    userId: "usr_001",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "act_002",
    type: "user_joined",
    description: "Sarah Chen joined the team",
    userId: "usr_002",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act_003",
    type: "project_updated",
    description: "Project 'Office Layout v2' was updated",
    userId: "usr_001",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act_004",
    type: "comment_added",
    description: "Comment added on 'Warehouse Design'",
    userId: "usr_003",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act_005",
    type: "project_created",
    description: "New project 'Parking Lot Blueprint' created",
    userId: "usr_002",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
