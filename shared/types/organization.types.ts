import { Document } from "mongoose";
import { UserTypes } from "./user.types";
import { ApiTypes } from "./api.types";

export namespace OrganizationTypes {
  export type OrganizationMemberRole = "owner" | "admin" | "member";
  export interface OrganizationModel extends Document {
    _id: string;
    name: string;
    owner: UserTypes.UserModel;
    members: {
      user: UserTypes.UserModel;
      role: OrganizationMemberRole;
    }[];
  }

  export interface OrganizationDTO {
    _id: string;
    name: string;
    owner: UserTypes.UserDTO;
    members: {
      user: UserTypes.UserDTO;
      role: OrganizationMemberRole;
    }[];
  }

  export interface OrganizationMemberListResponse {
    _id: string;
    fullName: string;
    email: string;
    role: OrganizationMemberRole;
  }

  export interface CreateOrganizationRequest extends ApiTypes.QueryOptions {
    body: { name: string };
  }

  export interface SwitchOrganizationRequest extends ApiTypes.QueryOptions {
    pathParams: { organizationId: string };
  }

  export interface UpdateOrganizationRequest extends ApiTypes.QueryOptions {
    pathParams: { organizationId: string };
    body: { name: string };
  }

  export interface GetOrganizationMembersRequest extends ApiTypes.QueryOptions {
    pathParams: { organizationId: string };
  }

  export interface EditMemberRoleRequest extends ApiTypes.QueryOptions {
    pathParams: { organizationId: string; memberId: string };
    body: { role: OrganizationTypes.OrganizationMemberRole };
  }

  export interface RemoveMemberRequest extends ApiTypes.QueryOptions {
    pathParams: { organizationId: string; memberId: string };
  }
}
