import type { User } from "./models/user";
import type { DashboardStats } from "./models/dashboard";

export type EventMap = {
  "auth.changed": { isAuthenticated: boolean; user: User | null };
  "auth.session-expired": void;
  "cad.project-loaded": { projectId: string };
  "cad.project-saved": { projectId: string };
  "cad.tool-changed": { tool: string };
  "dashboard.stats-updated": DashboardStats;
  "panel.opened": { type: string };
  "panel.closed": { type: string };
  error: { error: Error; context?: string };
  notification: { message: string; type: "info" | "success" | "warning" | "error" };
};
