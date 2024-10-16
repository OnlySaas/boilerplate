import {
  CustomHandler,
  formatErrorResponse,
  formatSuccessResponse,
  middyfy,
  Organization,
  sendResponse,
  User,
} from "@saas-boilerplate/shared";
import connectDatabase from "@saas-boilerplate/shared/connection";
import {
  createOrganizationBodySchema,
  createOrganizationSchema,
} from "../schemas/create-organization.schema";
import { Handler } from "aws-lambda";

const createOrganizationHandler: CustomHandler<
  typeof createOrganizationBodySchema
> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { name } = event.body;
  const { userId } = event.auth.payload;

  if (!name)
    return sendResponse(
      400,
      formatErrorResponse("Organization name is required")
    );

  try {
    await connectDatabase();

    const existingOrganization = await Organization.findOne({ name });
    if (existingOrganization)
      return sendResponse(
        400,
        formatErrorResponse("Organization with this name already exists")
      );

    const organization = await Organization.create({
      name,
      owner: userId,
      members: [{ user: userId, role: "owner" }],
      invitations: [],
    });

    await User.findByIdAndUpdate(userId, {
      $push: { organizations: organization._id },
      $set: { selectedOrganizationId: organization._id },
    });

    return sendResponse(
      200,
      formatSuccessResponse(organization, "Organization created successfully")
    );
  } catch (error) {
    console.error(error);
    return sendResponse(
      500,
      formatErrorResponse("Error creating organization")
    );
  }
};

export const handler = middyfy(
  createOrganizationHandler,
  createOrganizationSchema
) as Handler;
