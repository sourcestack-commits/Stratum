import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServices } from "@repo/services";
import { emit } from "@repo/core";
import { emitGlobalError } from "@repo/error-handling";
import type { SignupCredentials } from "@repo/types";

export function useSignup() {
  const { auth } = useServices();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: SignupCredentials) => auth.signup(credentials),
    onSuccess: (session) => {
      queryClient.setQueryData(["auth", "session"], session);
      emit("auth.changed", { isAuthenticated: true, user: session.user });
    },
    onError: (error) => {
      emitGlobalError(error as Error, "auth.signup");
    },
  });
}
