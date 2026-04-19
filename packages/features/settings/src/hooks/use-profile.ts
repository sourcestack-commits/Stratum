import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServices } from "@repo/services";
import type { User } from "@repo/types";

export function useProfile() {
  const { user } = useServices();
  const queryClient = useQueryClient();
  const profileQuery = useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => user.getProfile(),
  });
  const updateMutation = useMutation({
    mutationFn: (data: Partial<User>) => user.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
  });
  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    updateProfile: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}
