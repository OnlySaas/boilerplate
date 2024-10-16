import {
  CustomHandler,
  formatErrorResponse,
  formatSuccessResponse,
  middyfy,
  Organization,
  OrganizationTypes,
  sendResponse,
} from "@saas-boilerplate/shared";
import connectDatabase from "@saas-boilerplate/shared/connection";
import { Handler } from "aws-lambda";
import {
  updateOrganizationBodySchema,
  updateOrganizationParamsSchema,
  updateOrganizationSchema,
} from "../schemas/update-organization.schema";

const updateOrganizationHandler: CustomHandler<
  typeof updateOrganizationBodySchema,
  typeof updateOrganizationParamsSchema
> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { name } = event.body;
  const { organizationId } = event.pathParameters;

  if (!name)
    return sendResponse(
      400,
      formatErrorResponse("Organization name is required")
    );

  try {
    await connectDatabase();

    const organization = await Organization.findByIdAndUpdate(organizationId, {
      name,
    });

    const response = organization as OrganizationTypes.OrganizationDTO;

    return sendResponse(
      200,
      formatSuccessResponse(response, "Organization updated successfully")
    );
  } catch (error) {
    console.error(error);
    return sendResponse(
      500,
      formatErrorResponse("Error updating organization", error)
    );
  }
};

export const handler = middyfy(
  updateOrganizationHandler,
  updateOrganizationSchema
) as Handler;
