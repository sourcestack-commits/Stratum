import { useNavigate } from "react-router-dom";
import type { NotFoundPageProps } from "../types";
import { ErrorView } from "../components/error-view";

export function NotFoundPage({ redirectTo = "/" }: NotFoundPageProps) {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center p-6">
      <ErrorView error={404} onBack={() => navigate(redirectTo)} />
    </div>
  );
}
