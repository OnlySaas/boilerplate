import { OrganizationTypes } from "@saas-boilerplate/shared/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface OrganizationState {
  currentOrganization: OrganizationTypes.OrganizationDTO | null;
  organizations: OrganizationTypes.OrganizationDTO[];
  setOrganizations: (
    organizations: OrganizationTypes.OrganizationDTO[]
  ) => void;
  setCurrentOrganization: (
    organization: OrganizationTypes.OrganizationDTO
  ) => void;
}

export const useOrganization = create<OrganizationState>()(
  devtools((set) => ({
    currentOrganization: null,
    organizations: [],
    setOrganizations: (organizations: OrganizationTypes.OrganizationDTO[]) =>
      set({ organizations }),
    setCurrentOrganization: (organization: OrganizationTypes.OrganizationDTO) =>
      set({ currentOrganization: organization }),
  }))
);
