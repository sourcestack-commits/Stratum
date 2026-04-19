import { useCallback } from "react";
import { resolveHttpError } from "../resolver";
import { emitGlobalError } from "./use-global-error-handler";

export function useErrorHandler(context: string) {
  const handleError = useCallback(
    (error: unknown) => {
      const err = error instanceof Error ? error : new Error(String(error));
      const resolved = resolveHttpError(err);

      emitGlobalError(err, context);

      return resolved;
    },
    [context],
  );

  return { handleError };
}
