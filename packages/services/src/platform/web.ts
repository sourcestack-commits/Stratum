import { getApiBaseUrl } from "@repo/config";
import type { AuthService } from "../auth.service";
import type { CadService } from "../cad.service";
import type { DashboardService } from "../dashboard.service";
import type { UserService } from "../user.service";

function apiUrl(path: string): string {
  return `${getApiBaseUrl()}${path}`;
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const webAuthService: AuthService = {
  login: (creds) =>
    fetchJson(apiUrl("/auth/login"), { method: "POST", body: JSON.stringify(creds) }),
  signup: (creds) =>
    fetchJson(apiUrl("/auth/signup"), { method: "POST", body: JSON.stringify(creds) }),
  logout: () => fetchJson(apiUrl("/auth/logout"), { method: "POST" }),
  getSession: async () => {
    try {
      return await fetchJson(apiUrl("/auth/session"));
    } catch {
      return null;
    }
  },
};

export const webCadService: CadService = {
  getProject: (id) => fetchJson(apiUrl(`/cad/projects/${id}`)),
  listProjects: () => fetchJson(apiUrl("/cad/projects")),
  saveProject: (project) =>
    fetchJson(apiUrl(`/cad/projects/${project.id}`), {
      method: "PUT",
      body: JSON.stringify(project),
    }),
  deleteProject: (id) => fetchJson(apiUrl(`/cad/projects/${id}`), { method: "DELETE" }),
};

export const webDashboardService: DashboardService = {
  getStats: () => fetchJson(apiUrl("/dashboard/stats")),
  getRecentActivity: (limit = 10) => fetchJson(apiUrl(`/dashboard/activity?limit=${limit}`)),
};

export const webUserService: UserService = {
  getProfile: () => fetchJson(apiUrl("/user/profile")),
  updateProfile: (data) =>
    fetchJson(apiUrl("/user/profile"), { method: "PATCH", body: JSON.stringify(data) }),
};
