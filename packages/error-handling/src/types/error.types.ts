import type { ReactNode, ErrorInfo } from "react";

export type ErrorCategory = "client" | "server" | "network" | "unknown";

export interface HttpErrorDefinition {
  status: number;
  title: string;
  message: string;
  category: ErrorCategory;
}

export interface ErrorViewProps {
  error?: number | Error | string;
  title?: string;
  message?: string;
  className?: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export interface GlobalErrorHandlerOptions {
  onError?: (error: Error, context?: string) => void;
}

export interface ErrorProviderProps {
  children: ReactNode;
}

export interface NotFoundPageProps {
  redirectTo?: string;
}
