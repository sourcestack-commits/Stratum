import { useQuery } from "@tanstack/react-query";
import { useServices } from "@repo/services";

export function useAuth() {
  const { auth } = useServices();
  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: () => auth.getSession(),
    retry: false,
  });
  return {
    user: sessionQuery.data?.user ?? null,
    isAuthenticated: !!sessionQuery.data,
    isLoading: sessionQuery.isLoading,
  };
}
