import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        token: null,
        setToken: (token: string) => set({ token }),
        logout: () => set({ token: null }),
      }),
      { name: "token" }
    )
  )
);
