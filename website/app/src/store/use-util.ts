import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UtilState {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (isCollapsed: boolean) => void;
  acceptInvitationToken: string | null;
  setAcceptInvitationToken: (token: string | null) => void;
}

export const useUtil = create<UtilState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: true,
      setIsSidebarCollapsed: (isCollapsed) =>
        set({ isSidebarCollapsed: isCollapsed }),
      acceptInvitationToken: null,
      setAcceptInvitationToken: (token) => {
        set({ acceptInvitationToken: token });
      },
    }),
    { name: "util" }
  )
);
