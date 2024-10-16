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
import { Handler } from "aws-lambda";
import {
  switchOrganizationParamsSchema,
  switchOrganizationSchema,
} from "../schemas/switch-organization.schema";

const switchOrganizationHandler: CustomHandler<
  null,
  typeof switchOrganizationParamsSchema
> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { organizationId } = event.pathParameters;
  const { userId } = event.auth.payload;

  if (!organizationId)
    return sendResponse(
      400,
      formatErrorResponse("Organization id is required")
    );

  try {
    await connectDatabase();

    const existingOrganization = await Organization.findOne({
      _id: organizationId,
    });
    if (!existingOrganization)
      return sendResponse(
        400,
        formatErrorResponse("Organization with this id does not exist")
      );

    await User.findByIdAndUpdate(userId, {
      $set: {
        selectedOrganizationId: existingOrganization._id,
      },
    });

    return sendResponse(
      200,
      formatSuccessResponse(null, "Organization switched successfully")
    );
  } catch (error) {
    console.error(error);
    return sendResponse(
      500,
      formatErrorResponse("Error switching organization")
    );
  }
};

export const handler = middyfy(
  switchOrganizationHandler,
  switchOrganizationSchema
) as Handler;
