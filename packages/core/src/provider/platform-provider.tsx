import { QueryClientProvider } from "@tanstack/react-query";
import { ServiceProvider } from "@repo/services";
import { queryClient } from "../query-client";
import type { PlatformProviderProps } from "../types";

export function PlatformProvider({ children }: PlatformProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ServiceProvider>{children}</ServiceProvider>
    </QueryClientProvider>
  );
}
