import { handleError } from "@/lib/error-handler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiTypes, UserTypes } from "@saas-boilerplate/shared/types";
import { toast } from "sonner";
import { apiClient } from "./client";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiTypes.ApiResponse<UserTypes.UserAuthResponse>,
    void,
    UserTypes.LoginRequest
  >({
    mutationKey: ["/auth/login"],
    mutationFn: async (args: UserTypes.LoginRequest) => {
      const { data } = await apiClient.post<
        ApiTypes.ApiResponse<UserTypes.UserAuthResponse>
      >(`/auth/login`, args);

      return data;
    },
    onSuccess: (data: ApiTypes.ApiResponse<UserTypes.UserAuthResponse>) => {
      toast.success(data.message || "Logged in successfully");
      queryClient.invalidateQueries({ queryKey: ["/me", "/organizations"] });
    },
    onError: (error) => handleError(error),
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.ApiResponse<UserTypes.UserAuthResponse>,
    void,
    UserTypes.RegisterRequest
  >({
    mutationKey: ["/auth/register"],
    mutationFn: async (args: UserTypes.RegisterRequest) => {
      const { data } = await apiClient.post<
        ApiTypes.ApiResponse<UserTypes.UserAuthResponse>
      >(`/auth/register`, args);

      return data;
    },
    onSuccess: (data: ApiTypes.ApiResponse<UserTypes.UserAuthResponse>) => {
      toast.success(data.message || "Registered successfully");
      queryClient.invalidateQueries({ queryKey: ["/me", "/organizations"] });
    },
    onError: (error) => handleError(error),
  });
}

export function useForgotPassword() {
  return useMutation<
    ApiTypes.ApiResponse<UserTypes.UserAuthResponse>,
    void,
    UserTypes.ForgotPasswordRequest
  >({
    mutationKey: ["/auth/forgot-password"],
    mutationFn: async (args: UserTypes.ForgotPasswordRequest) => {
      const { data } = await apiClient.post<
        ApiTypes.ApiResponse<UserTypes.UserAuthResponse>
      >(`/auth/forgot-password`, args);

      return data;
    },
    onSuccess: (data: ApiTypes.ApiResponse<UserTypes.UserAuthResponse>) => {
      toast.success(data.message || "Forgot password successfully");
    },
    onError: (error) => handleError(error),
  });
}

export function useResetPassword() {
  return useMutation<
    ApiTypes.ApiResponse<UserTypes.UserAuthResponse>,
    void,
    UserTypes.ResetPasswordRequest
  >({
    mutationKey: ["/auth/reset-password"],
    mutationFn: async (args: UserTypes.ResetPasswordRequest) => {
      const { data } = await apiClient.post<
        ApiTypes.ApiResponse<UserTypes.UserAuthResponse>
      >(`/auth/reset-password`, args);

      return data;
    },
    onSuccess: (data: ApiTypes.ApiResponse<UserTypes.UserAuthResponse>) => {
      toast.success(data.message || "Reset password successfully");
    },
    onError: (error) => handleError(error),
  });
}

export function useVerifyEmail() {
  return useMutation<
    ApiTypes.ApiResponse<UserTypes.UserAuthResponse>,
    void,
    UserTypes.VerifyEmailRequest
  >({
    mutationKey: ["/auth/verify-email"],
    mutationFn: async (args: UserTypes.VerifyEmailRequest) => {
      const { data } = await apiClient.post<
        ApiTypes.ApiResponse<UserTypes.UserAuthResponse>
      >(`/auth/verify-email`, args);

      return data;
    },
    onSuccess: (data: ApiTypes.ApiResponse<UserTypes.UserAuthResponse>) => {
      toast.success(data.message || "Verified email successfully");
    },
    onError: (error) => handleError(error),
  });
}

export function useResendVerificationEmail() {
  return useMutation<
    ApiTypes.ApiResponse<UserTypes.UserAuthResponse>,
    void,
    UserTypes.ResendVerificationEmailRequest
  >({
    mutationKey: ["/auth/resend-verification-email"],
    mutationFn: async (args: UserTypes.ResendVerificationEmailRequest) => {
      const { data } = await apiClient.post<
        ApiTypes.ApiResponse<UserTypes.UserAuthResponse>
      >(`/auth/resend-verification-email`, args);

      return data;
    },
    onSuccess: (data: ApiTypes.ApiResponse<UserTypes.UserAuthResponse>) => {
      toast.success(data.message || "Resent verification email successfully");
    },
    onError: (error) => handleError(error),
  });
}
