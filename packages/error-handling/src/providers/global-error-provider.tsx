import type { ErrorProviderProps } from "../types";
import { ErrorBoundary } from "../components/error-boundary";
import { useGlobalErrorHandler } from "../hooks/use-global-error-handler";
import { resolveHttpError } from "../resolver";
import { toast } from "sonner";

function GlobalErrorListener() {
  useGlobalErrorHandler({
    onError: (error) => {
      const resolved = resolveHttpError(error);
      toast.error(resolved.title, {
        description: resolved.message,
      });
    },
  });
  return null;
}

export function GlobalErrorProvider({ children }: ErrorProviderProps) {
  return (
    <ErrorBoundary>
      <GlobalErrorListener />
      {children}
    </ErrorBoundary>
  );
}
