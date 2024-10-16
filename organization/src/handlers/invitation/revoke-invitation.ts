import {
  CustomHandler,
  formatErrorResponse,
  formatSuccessResponse,
  Invitation,
  middyfy,
  sendResponse,
} from "@saas-boilerplate/shared";
import connectDatabase from "@saas-boilerplate/shared/connection";
import { Handler } from "aws-lambda";
import {
  pendingInvitationRevokeParamsSchema,
  pendingInvitationRevokeSchema,
} from "../../schemas/invitation/revoke-invitation.schema";

const revokeInvitationHandler: CustomHandler<
  null,
  typeof pendingInvitationRevokeParamsSchema
> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { organizationId, invitationId } = event.pathParameters;

  try {
    await connectDatabase();

    const invitation = await Invitation.findOne({
      _id: invitationId,
      organization: organizationId,
      status: "pending",
    });

    if (!invitation)
      return sendResponse(404, formatErrorResponse("Invitation not found"));

    invitation.status = "revoked";
    await invitation.save();

    return sendResponse(
      200,
      formatSuccessResponse(invitation, "Invitation revoked successfully")
    );
  } catch (error) {
    console.error(error);
    return sendResponse(
      500,
      formatErrorResponse("Failed to revoke invitation")
    );
  }
};

export const handler = middyfy(
  revokeInvitationHandler,
  pendingInvitationRevokeSchema
) as Handler;
