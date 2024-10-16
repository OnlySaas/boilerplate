import { Document } from "mongoose";
import { OrganizationTypes } from "./organization.types";
import { ApiTypes } from "./api.types";

export namespace UserTypes {
  export interface UserModel extends Document {
    _id: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email: string;
    passwordHash: string;
    isEmailVerified: boolean;
    resetToken?: string;
    resetTokenExpiry?: number;
    organizations: OrganizationTypes.OrganizationModel[];
    selectedOrganizationId: string;
  }

  export interface UserDTO {
    _id: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email: string;
    isEmailVerified: boolean;
    organizations: OrganizationTypes.OrganizationModel[];
    selectedOrganizationId: string;
  }

  export type UserAuthResponse = {
    token: string;
  };

  export type UpdateProfileRequest = ApiTypes.QueryOptions & {
    body: {
      firstName: string;
      lastName: string;
    };
  };

  export interface LoginRequest {
    email: string;
    password: string;
  }

  export interface RegisterRequest {
    email: string;
    password: string;
  }

  export interface ForgotPasswordRequest {
    email: string;
  }

  export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
  }

  export interface VerifyEmailRequest {
    token: string;
  }

  export interface ResendVerificationEmailRequest {
    email: string;
  }

}
