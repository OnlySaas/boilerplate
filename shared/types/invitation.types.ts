import { Document } from "mongoose";
import { OrganizationTypes } from "./organization.types";
import { ApiTypes } from "./api.types";
export namespace InvitationTypes {
  export interface InvitationModel extends Document {
    _id: string;
    organization: OrganizationTypes.OrganizationModel;
    email: string;
    role: string;
    token: string;
    expiresAt: Date;
    status: string;
  }

  export interface InvitationDTO {
    _id: string;
    organization: OrganizationTypes.OrganizationDTO;
    email: string;
    role: string;
    token: string;
    expiresAt: Date;
    status: string;
  }

  export interface CreateInvitationRequest {
    body: {
      email: string;
      role: string;
    };
    pathParams: { organizationId: string };
  }

  export interface GetInvitationRequest extends ApiTypes.QueryOptions {
    pathParams: { token: string };
  }

  export interface AcceptInvitationRequest extends ApiTypes.QueryOptions {
    pathParams: { token: string };
  }

  export interface RevokeInvitationRequest extends ApiTypes.QueryOptions {
    pathParams: { organizationId: string; invitationId: string };
  }

  export interface ListPendingInvitationsRequest extends ApiTypes.QueryOptions {
    pathParams: { organizationId: string };
  }
}
