import { handleError } from "@/lib/error-handler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiTypes, UserTypes } from "@saas-boilerplate/shared/types";
import { toast } from "sonner";
import { apiClient } from "./client";
import { useUser } from "@/store/use-user";
import { useOrganization } from "@/store/use-organization";
import { useAuth } from "@/store/use-auth";

export function useCurrentUser() {
  const token = useAuth((state) => state.token);
  const setUser = useUser((state) => state.setUser);
  const setOrganizations = useOrganization((state) => state.setOrganizations);
  const setCurrentOrganization = useOrganization(
    (state) => state.setCurrentOrganization
  );
  return useQuery({
    queryKey: ["/me"],
    enabled: !!token,
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<
          ApiTypes.ApiResponse<UserTypes.UserDTO>
        >("/auth/me");
        const userData = data.data;
        setUser(userData);
        setOrganizations(userData?.organizations);

        const selectedOrganization = userData.organizations.find(
          (org) => org._id === userData.selectedOrganizationId
        );

        if (userData.selectedOrganizationId && selectedOrganization) {
          setCurrentOrganization(selectedOrganization);
        } else {
          setCurrentOrganization(userData.organizations[0]);
        }
        return data.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiTypes.ApiResponse<UserTypes.UserDTO>,
    void,
    UserTypes.UpdateProfileRequest
  >({
    mutationKey: ["/users/profile"],
    mutationFn: async (args: UserTypes.UpdateProfileRequest) => {
      const { data } = await apiClient.put<
        ApiTypes.ApiResponse<UserTypes.UserDTO>
      >(`/profile`, args.body);

      return data;
    },
    onSuccess: (data: ApiTypes.ApiResponse<UserTypes.UserDTO>) => {
      toast.success(data.message || "Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["/me"] });
    },
    onError: (error) => handleError(error),
  });
}
