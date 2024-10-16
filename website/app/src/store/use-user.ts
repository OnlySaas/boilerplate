import { UserTypes, OrganizationTypes } from "@saas-boilerplate/shared/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UserState {
  user: UserTypes.UserDTO | null;
  currentOrganization: OrganizationTypes.OrganizationDTO | null;
  setUser: (user: UserTypes.UserDTO | null) => void;
  setCurrentOrganization: (
    organization: OrganizationTypes.OrganizationDTO
  ) => void;
}

export const useUser = create<UserState>()(
  devtools((set) => ({
    user: null,
    currentOrganization: null,
    setUser: (user: UserTypes.UserDTO | null) => set({ user }),
    setCurrentOrganization: (organization: OrganizationTypes.OrganizationDTO) =>
      set({ currentOrganization: organization }),
  }))
);
