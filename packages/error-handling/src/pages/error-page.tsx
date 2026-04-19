import { useNavigate } from "react-router-dom";
import { ErrorView } from "../components/error-view";

interface ErrorPageProps {
  error?: number | Error | string;
  redirectTo?: string;
}

export function ErrorPage({ error = 500, redirectTo = "/" }: ErrorPageProps) {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center p-6">
      <ErrorView
        error={error}
        onBack={() => navigate(redirectTo)}
        onRetry={() => window.location.reload()}
      />
    </div>
  );
}
