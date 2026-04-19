export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user" | "viewer";
  avatarUrl?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}
