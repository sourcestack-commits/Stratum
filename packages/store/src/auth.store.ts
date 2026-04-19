import { create } from "zustand";
import type { AuthState } from "./types";

export const useAuthStore = create<AuthState>((set) => ({
  isLoginModalOpen: false,
  redirectAfterLogin: null,
  openLoginModal: (redirect) =>
    set({ isLoginModalOpen: true, redirectAfterLogin: redirect ?? null }),
  closeLoginModal: () => set({ isLoginModalOpen: false, redirectAfterLogin: null }),
}));
