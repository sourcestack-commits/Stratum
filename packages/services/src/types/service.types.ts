import type { ReactNode } from "react";
import type {
  AuthSession,
  LoginCredentials,
  SignupCredentials,
  User,
  CadProject,
  DashboardStats,
  ActivityItem,
} from "@repo/types";

export interface AuthService {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  signup(credentials: SignupCredentials): Promise<AuthSession>;
  logout(): Promise<void>;
  getSession(): Promise<AuthSession | null>;
}

export interface CadService {
  getProject(id: string): Promise<CadProject>;
  listProjects(): Promise<CadProject[]>;
  saveProject(project: CadProject): Promise<CadProject>;
  deleteProject(id: string): Promise<void>;
}

export interface DashboardService {
  getStats(): Promise<DashboardStats>;
  getRecentActivity(limit?: number): Promise<ActivityItem[]>;
}

export interface UserService {
  getProfile(): Promise<User>;
  updateProfile(data: Partial<User>): Promise<User>;
}

export interface Services {
  auth: AuthService;
  cad: CadService;
  dashboard: DashboardService;
  user: UserService;
}

export interface ServiceProviderProps {
  children: ReactNode;
}
