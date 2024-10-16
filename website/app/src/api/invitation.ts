import { handleError } from "@/lib/error-handler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiTypes, InvitationTypes } from "@saas-boilerplate/shared/types";
import { toast } from "sonner";
import { apiClient } from "./client";

export function useGetInvitation(args: InvitationTypes.GetInvitationRequest) {
  return useQuery<ApiTypes.ApiResponse<InvitationTypes.InvitationDTO>>({
    queryKey: ["/organizations/invitations/:token", args.pathParams.token],
    queryFn: async ({ queryKey }) => {
      const [, token] = queryKey;
      try {
        const { data } = await apiClient.get<
          ApiTypes.ApiResponse<InvitationTypes.InvitationDTO>
        >(`/organizations/invitations/${token}`);

        return data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    enabled: !!args.pathParams.token,
  });
}

export function useListPendingInvitations(
  args: InvitationTypes.ListPendingInvitationsRequest
) {
  return useQuery<ApiTypes.ApiResponse<InvitationTypes.InvitationDTO[]>>({
    queryKey: [
      "/organizations/:organizationId/invitations/pending",
      args.pathParams.organizationId,
    ],
    queryFn: async ({ queryKey }) => {
      const [, organizationId] = queryKey;
      try {
        const { data } = await apiClient.get<
          ApiTypes.ApiResponse<InvitationTypes.InvitationDTO[]>
        >(`/organizations/${organizationId}/invitations/pending`);

        return data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    enabled: !!args.pathParams.organizationId,
  });
}

export function useRevokeInvitation(
  args: InvitationTypes.RevokeInvitationRequest
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiTypes.ApiResponse<InvitationTypes.InvitationDTO>,
    void,
    InvitationTypes.RevokeInvitationRequest
  >({
    mutationKey: ["/organizations/:organizationId/invitations/:invitationId"],
    mutationFn: async (args: InvitationTypes.RevokeInvitationRequest) => {
      const { data } = await apiClient.delete<
        ApiTypes.ApiResponse<InvitationTypes.InvitationDTO>
      >(
        `/organizations/${args.pathParams.organizationId}/invitations/${args.pathParams.invitationId}`
      );

      return data;
    },
    onSuccess: (data: ApiTypes.ApiResponse<InvitationTypes.InvitationDTO>) => {
      toast.success(data.message || "Invitation revoked successfully");
      queryClient.invalidateQueries({
        queryKey: [
          "/organizations/:organizationId/invitations/pending",
          args.pathParams.organizationId,
        ],
      });
    },
    onError: (error) => handleError(error),
  });
}

export function useCreateInvitation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiTypes.ApiResponse<InvitationTypes.InvitationDTO>,
    void,
    InvitationTypes.CreateInvitationRequest
  >({
    mutationKey: ["/organizations/:organizationId/invitations"],
    mutationFn: async (args: InvitationTypes.CreateInvitationRequest) => {
      const { data } = await apiClient.post<
        ApiTypes.ApiResponse<InvitationTypes.InvitationDTO>
      >(
        `/organizations/${args.pathParams.organizationId}/invitations`,
        args.body
      );

      return data;
    },
    onSuccess: (data: ApiTypes.ApiResponse<InvitationTypes.InvitationDTO>) => {
      queryClient.invalidateQueries({
        queryKey: ["/organizations/:organizationId/members"],
        refetchType: "all",
      });
      toast.success(data.message || "Invitation sent successfully");
    },
    onError: (error) => handleError(error),
  });
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiTypes.ApiResponse<InvitationTypes.InvitationDTO>,
    void,
    InvitationTypes.AcceptInvitationRequest
  >({
    mutationKey: ["/organizations/invitations/:token/accept"],
    mutationFn: async (args: InvitationTypes.AcceptInvitationRequest) => {
      const { data } = await apiClient.get<
        ApiTypes.ApiResponse<InvitationTypes.InvitationDTO>
      >(`/organizations/invitations/${args.pathParams.token}/accept`);

      return data;
    },
    onSuccess: (data: ApiTypes.ApiResponse<InvitationTypes.InvitationDTO>) => {
      queryClient.refetchQueries({
        queryKey: ["/me"],
      });
      toast.success(data.message || "Invitation accepted successfully");
    },
    onError: (error) => handleError(error),
  });
}
