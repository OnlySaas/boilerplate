import {
  CustomHandler,
  formatErrorResponse,
  formatSuccessResponse,
  Invitation,
  middyfy,
  Organization,
  sendResponse,
} from "@saas-boilerplate/shared";
import connectDatabase from "@saas-boilerplate/shared/connection";
import { Handler } from "aws-lambda";
import jwt from "jsonwebtoken";
import {
  createInvitationBodySchema,
  createInvitationPathParametersSchema,
  createInvitationSchema,
} from "../../schemas/invitation/create-invitation.schema";
import { triggerCreateInvitationEmail } from "../../utils/trigger-create-invitation-email";

const inviteMemberHandler: CustomHandler<
  typeof createInvitationBodySchema,
  typeof createInvitationPathParametersSchema
> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { email, role } = event.body;
  const { organizationId } = event.pathParameters;
  const { userId } = event.auth.payload;

  console.log(organizationId, email, role, userId);

  if (!email || !role)
    return sendResponse(
      400,
      formatErrorResponse("Email and role are required")
    );

  try {
    await connectDatabase();

    const organization = await Organization.findById(organizationId);
    if (!organization)
      return sendResponse(400, formatErrorResponse("Organization not found"));

    const alreadyInvited = await Invitation.findOne({
      email,
      organization: organizationId,
      status: "pending",
      expiresAt: { $gte: new Date() },
    });

    if (alreadyInvited)
      return sendResponse(
        400,
        formatErrorResponse("User is already invited to the organization")
      );

    const token = jwt.sign(
      { organizationId, email, role },
      process.env.VERIFICATION_TOKEN_SECRET as string,
      { expiresIn: "24h" }
    );

    const invitation = new Invitation({
      email,
      organization: organizationId,
      role,
      token,
      createdBy: userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
      sendAt: new Date(),
    });

    await invitation.save();

    await triggerCreateInvitationEmail(email, organization, token);

    return sendResponse(
      200,
      formatSuccessResponse(
        null,
        "Invitation sent successfully. Please check your email for the invitation link."
      )
    );
  } catch (error) {
    console.error(error);
    return sendResponse(
      500,
      formatErrorResponse("Error inviting member", error)
    );
  }
};

export const handler = middyfy(
  inviteMemberHandler,
  createInvitationSchema
) as Handler;
