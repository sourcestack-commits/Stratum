import { QueryClient } from "@tanstack/react-query";
import { QUERY_CONFIG } from "@repo/config";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CONFIG.staleTimeMs,
      retry: QUERY_CONFIG.retryCount,
      refetchOnWindowFocus: QUERY_CONFIG.refetchOnWindowFocus,
    },
  },
});
