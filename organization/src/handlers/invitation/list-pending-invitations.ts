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
  pendingInvitationListParamsSchema,
  pendingInvitationListSchema,
} from "../../schemas/invitation/list-pending-invitations.schema";

const listPendingInvitationsHandler: CustomHandler<
  null,
  typeof pendingInvitationListParamsSchema
> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { organizationId } = event.pathParameters;

  try {
    await connectDatabase();

    const invitations = await Invitation.find({
      organization: organizationId,
      status: "pending",
    });

    return sendResponse(
      200,
      formatSuccessResponse(invitations, "Invitations fetched successfully")
    );
  } catch (error) {
    console.error(error);
    return sendResponse(
      500,
      formatErrorResponse("Failed to fetch invitations")
    );
  }
};

export const handler = middyfy(
  listPendingInvitationsHandler,
  pendingInvitationListSchema
) as Handler;
