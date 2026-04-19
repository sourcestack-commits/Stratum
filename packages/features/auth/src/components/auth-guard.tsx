import { Loader } from "@repo/design-system";
import { useAuth } from "../hooks/use-auth";
import { LoginForm } from "./login-form";
import type { AuthGuardProps } from "../types";

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-neutral-950">
        <Loader size="lg" />
      </div>
    );
  if (!isAuthenticated)
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-neutral-950">
        <LoginForm />
      </div>
    );
  return <>{children}</>;
}
