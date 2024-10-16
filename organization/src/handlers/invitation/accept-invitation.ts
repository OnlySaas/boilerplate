import {
  formatErrorResponse,
  formatSuccessResponse,
  middyfy,
  OrganizationTypes,
  sendResponse,
} from "@saas-boilerplate/shared";
import connectDatabase from "@saas-boilerplate/shared/connection";
import type { CustomHandler } from "@saas-boilerplate/shared/middyfy";
import {
  Invitation,
  Organization,
  User,
} from "@saas-boilerplate/shared/models";
import { Handler } from "aws-lambda";
import jwt from "jsonwebtoken";
import {
  acceptInvitationParamsSchema,
  acceptInvitationSchema,
} from "../../schemas/invitation/accept-invitation.schema";

const acceptInvitationHandler: CustomHandler<
  null,
  typeof acceptInvitationParamsSchema
> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const VERIFICATION_TOKEN_SECRET: string = process.env
    .VERIFICATION_TOKEN_SECRET as string;

  const token = event.pathParameters.token;

  if (!token) {
    return sendResponse(
      400,
      formatErrorResponse("Invitation token is missing")
    );
  }

  try {
    await connectDatabase();

    // Verify the token
    const decodedToken = jwt.verify(token, VERIFICATION_TOKEN_SECRET) as {
      organizationId: string;
      email: string;
      role: OrganizationTypes.OrganizationMemberRole;
    };

    // Find the user
    const user = await User.findOne({ email: decodedToken.email });

    if (!user)
      return sendResponse(404, formatErrorResponse("User not registered"));

    const invitation = await Invitation.findOne({
      token,
      email: decodedToken.email,
      organization: decodedToken.organizationId,
      status: "pending",
      expiresAt: { $gte: new Date() },
    });

    if (!invitation)
      return sendResponse(
        404,
        formatErrorResponse("Invitation not valid or expired")
      );

    invitation.status = "accepted";
    await invitation.save();

    const organization = await Organization.findById(
      decodedToken.organizationId
    );

    if (!organization)
      return sendResponse(404, formatErrorResponse("Organization not found"));

    organization.members.push({ user, role: decodedToken.role });
    await organization.save();

    user.organizations.push(organization);
    await user.save();

    return sendResponse(
      200,
      formatSuccessResponse({
        message: "Invitation accepted successfully",
      })
    );
  } catch (error) {
    return sendResponse(
      500,
      formatErrorResponse("Failed to accept invitation", error.message)
    );
  }
};

export const handler = middyfy(
  acceptInvitationHandler,
  acceptInvitationSchema
) as Handler;
