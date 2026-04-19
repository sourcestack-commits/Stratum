import type { AuthService } from "../auth.service";
import type { CadService } from "../cad.service";
import type { DashboardService } from "../dashboard.service";
import type { UserService } from "../user.service";

async function invoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  const { invoke: tauriInvoke } = await import("@tauri-apps/api/core");
  return tauriInvoke<T>(command, args);
}

export const tauriAuthService: AuthService = {
  login: (creds) => invoke("auth_login", { credentials: creds }),
  signup: (creds) => invoke("auth_signup", { credentials: creds }),
  logout: () => invoke("auth_logout"),
  getSession: () => invoke("auth_get_session"),
};

export const tauriCadService: CadService = {
  getProject: (id) => invoke("cad_get_project", { id }),
  listProjects: () => invoke("cad_list_projects"),
  saveProject: (project) => invoke("cad_save_project", { project }),
  deleteProject: (id) => invoke("cad_delete_project", { id }),
};

export const tauriDashboardService: DashboardService = {
  getStats: () => invoke("dashboard_get_stats"),
  getRecentActivity: (limit = 10) => invoke("dashboard_get_activity", { limit }),
};

export const tauriUserService: UserService = {
  getProfile: () => invoke("user_get_profile"),
  updateProfile: (data) => invoke("user_update_profile", { data }),
};
