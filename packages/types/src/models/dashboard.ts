export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalUsers: number;
  recentUpdates: number;
}

export interface ActivityItem {
  id: string;
  type: "project_created" | "project_updated" | "user_joined" | "comment_added";
  description: string;
  userId: string;
  timestamp: string;
}
