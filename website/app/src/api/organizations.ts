import { handleError } from "@/lib/error-handler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiTypes, OrganizationTypes } from "@saas-boilerplate/shared/types";
import { toast } from "sonner";
import { apiClient } from "./client";

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiTypes.ApiResponse<OrganizationTypes.OrganizationDTO>,
    void,
    OrganizationTypes.CreateOrganizationRequest
  >({
    mutationKey: ["/organizations"],
    mutationFn: async (args: OrganizationTypes.CreateOrganizationRequest) => {
      const { data } = await apiClient.post<
        ApiTypes.ApiResponse<OrganizationTypes.OrganizationDTO>
      >(`/organizations`, args.body);

      return data;
    },
    onSuccess: (
      data: ApiTypes.ApiResponse<OrganizationTypes.OrganizationDTO>
    ) => {
      toast.success(data.message || "Organization created successfully");
      queryClient.invalidateQueries({ queryKey: ["/me"] });
    },
    onError: (error) => handleError(error),
  });
}

export function useSwitchOrganization() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiTypes.ApiResponse<OrganizationTypes.OrganizationDTO>,
    void,
    OrganizationTypes.SwitchOrganizationRequest
  >({
    mutationKey: ["/organizations/switch"],
    mutationFn: async (args: OrganizationTypes.SwitchOrganizationRequest) => {
      const { data } = await apiClient.put<
        ApiTypes.ApiResponse<OrganizationTypes.OrganizationDTO>
      >(`/organizations/${args.pathParams.organizationId}/switch`);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/organizations"] });
    },
    onError: (error) => handleError(error),
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiTypes.ApiResponse<OrganizationTypes.OrganizationDTO>,
    void,
    OrganizationTypes.UpdateOrganizationRequest
  >({
    mutationKey: ["/organizations/:organizationId"],
    mutationFn: async (args: OrganizationTypes.UpdateOrganizationRequest) => {
      const { data } = await apiClient.put<
        ApiTypes.ApiResponse<OrganizationTypes.OrganizationDTO>
      >(`/organizations/${args.pathParams.organizationId}`, args.body);

      return data;
    },
    onSuccess: (
      data: ApiTypes.ApiResponse<OrganizationTypes.OrganizationDTO>
    ) => {
      queryClient.invalidateQueries({ queryKey: ["/organizations"] });
      toast.success(data.message || "Organization updated successfully");
    },
    onError: (error) => handleError(error),
  });
}

export function useEditMemberRole() {
  return useMutation<
    ApiTypes.ApiResponse<OrganizationTypes.OrganizationDTO>,
    void,
    OrganizationTypes.EditMemberRoleRequest
  >({
    mutationKey: ["/organizations/:organizationId/members/:memberId"],
    mutationFn: async (args: OrganizationTypes.EditMemberRoleRequest) => {
      const { data } = await apiClient.put<
        ApiTypes.ApiResponse<OrganizationTypes.OrganizationDTO>
      >(
        `/organizations/${args.pathParams.organizationId}/members/${args.pathParams.memberId}`,
        args.body
      );

      return data;
    },
    onSuccess: (
      data: ApiTypes.ApiResponse<OrganizationTypes.OrganizationDTO>
    ) => {
      toast.success(data.message || "Member role updated successfully");
    },
    onError: (error) => handleError(error),
  });
}

export function useRemoveMemberRole() {
  return useMutation<
    ApiTypes.ApiResponse<OrganizationTypes.OrganizationDTO>,
    void,
    OrganizationTypes.RemoveMemberRequest
  >({
    mutationKey: ["/organizations/:organizationId/members/:memberId"],
    mutationFn: async (args: OrganizationTypes.RemoveMemberRequest) => {
      const { data } = await apiClient.delete<
        ApiTypes.ApiResponse<OrganizationTypes.OrganizationDTO>
      >(
        `/organizations/${args.pathParams.organizationId}/members/${args.pathParams.memberId}`
      );

      return data;
    },
    onSuccess: (
      data: ApiTypes.ApiResponse<OrganizationTypes.OrganizationDTO>
    ) => {
      toast.success(data.message || "Member removed successfully");
    },
    onError: (error) => handleError(error),
  });
}

export function useGetOrganizationMembers(
  args: OrganizationTypes.GetOrganizationMembersRequest
) {
  return useQuery<
    ApiTypes.ApiResponse<OrganizationTypes.OrganizationMemberListResponse[]>
  >({
    queryKey: [
      "/organizations/:organizationId/members",
      args.pathParams.organizationId,
    ],
    queryFn: async ({ queryKey }) => {
      const [, organizationId] = queryKey;
      try {
        const { data } = await apiClient.get<
          ApiTypes.ApiResponse<
            OrganizationTypes.OrganizationMemberListResponse[]
          >
        >(`/organizations/${organizationId}/members`);

        return data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    enabled: !!args.pathParams.organizationId,
  });
}
