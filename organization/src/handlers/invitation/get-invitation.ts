import {
  CustomHandler,
  formatErrorResponse,
  formatSuccessResponse,
  Invitation,
  middyfy,
  OrganizationTypes,
  sendResponse,
  User,
} from "@saas-boilerplate/shared";
import connectDatabase from "@saas-boilerplate/shared/connection";
import { Handler } from "aws-lambda";
import jwt from "jsonwebtoken";
import {
  getInvitationPathParamsSchema,
  getInvitationSchema,
} from "../../schemas/invitation/get-invitation.schema";
const getInvitationHandler: CustomHandler<
  null,
  typeof getInvitationPathParamsSchema,
  { allowAuth: false }
> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const VERIFICATION_TOKEN_SECRET: string = process.env
    .VERIFICATION_TOKEN_SECRET as string;
  const { token } = event.pathParameters;

  if (!token)
    return sendResponse(
      400,
      formatErrorResponse("Email and role are required")
    );

  try {
    await connectDatabase();

    // Verify the token
    const decodedToken = jwt.verify(token, VERIFICATION_TOKEN_SECRET) as {
      organizationId: string;
      email: string;
      role: OrganizationTypes.OrganizationMemberRole;
    };

    const user = await User.findOne({ email: decodedToken.email });

    if (!user)
      return sendResponse(
        200,
        formatSuccessResponse(null, "User not registered")
      );

    const invitation = await Invitation.findOne({
      token,
      email: decodedToken.email,
      organization: decodedToken.organizationId,
      status: "pending",
    });

    if (!invitation)
      return sendResponse(
        404,
        formatErrorResponse("Invitation not valid or expired")
      );

    return sendResponse(
      200,
      formatSuccessResponse(
        {
          id: invitation._id,
          email: invitation.email,
          role: invitation.role,
          organizationId: invitation.organization,
        },
        "Invitation retrieved successfully"
      )
    );
  } catch (error) {
    console.error(error);
    return sendResponse(
      500,
      formatErrorResponse("Error getting invitation", error)
    );
  }
};

export const handler = middyfy(getInvitationHandler, getInvitationSchema, {
  allowAuth: false,
}) as Handler;
