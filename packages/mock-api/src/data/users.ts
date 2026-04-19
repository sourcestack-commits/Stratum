import type { User, AuthSession } from "@repo/types";

export const MOCK_USERS: Array<{ email: string; password: string; user: User }> = [
  {
    email: "admin@cadvisor.com",
    password: "admin123",
    user: {
      id: "usr_001",
      email: "admin@cadvisor.com",
      name: "Admin User",
      role: "admin",
      avatarUrl: undefined,
      createdAt: "2024-01-01T00:00:00Z",
    },
  },
  {
    email: "user@cadvisor.com",
    password: "user123",
    user: {
      id: "usr_002",
      email: "user@cadvisor.com",
      name: "John Doe",
      role: "user",
      avatarUrl: undefined,
      createdAt: "2024-03-15T00:00:00Z",
    },
  },
  {
    email: "viewer@cadvisor.com",
    password: "viewer123",
    user: {
      id: "usr_003",
      email: "viewer@cadvisor.com",
      name: "Jane Smith",
      role: "viewer",
      avatarUrl: undefined,
      createdAt: "2024-06-01T00:00:00Z",
    },
  },
];

let currentSession: AuthSession | null = null;

export function setSession(session: AuthSession | null): void {
  currentSession = session;
}

export function getSession(): AuthSession | null {
  return currentSession;
}

export function createSession(user: User): AuthSession {
  const session: AuthSession = {
    user,
    token: `mock_token_${user.id}_${Date.now()}`,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
  currentSession = session;
  return session;
}
