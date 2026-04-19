import { useQuery } from "@tanstack/react-query";
import { useServices } from "@repo/services";

export function useRecentActivity(limit = 10) {
  const { dashboard } = useServices();
  return useQuery({
    queryKey: ["dashboard", "activity", limit],
    queryFn: () => dashboard.getRecentActivity(limit),
  });
}
