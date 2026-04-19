import { useQuery } from "@tanstack/react-query";
import { useServices } from "@repo/services";

export function useDashboardStats() {
  const { dashboard } = useServices();
  return useQuery({ queryKey: ["dashboard", "stats"], queryFn: () => dashboard.getStats() });
}
