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
  organizationMemberListParamsSchema,
  organizationMemberListSchema,
} from "../schemas/list-members.schema";

const listOrganizationMembersHandler: CustomHandler<
  null,
  typeof organizationMemberListParamsSchema
> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { organizationId } = event.pathParameters;

  try {
    await connectDatabase();
    const organization = await Organization.findById(organizationId).populate(
      "members.user"
    );

    if (!organization)
      return sendResponse(404, formatErrorResponse("Organization not found"));

    const response: OrganizationTypes.OrganizationMemberListResponse[] =
      organization.members.map((member) => {
        return {
          _id: member.user._id,
          fullName: member.user.fullName,
          email: member.user.email,
          role: member.role,
        };
      });

    return sendResponse(
      200,
      formatSuccessResponse(response, "Members fetched successfully")
    );
  } catch (error) {
    console.error(error);
    return sendResponse(500, formatErrorResponse("Failed to fetch members"));
  }
};

export const handler = middyfy(
  listOrganizationMembersHandler,
  organizationMemberListSchema
) as Handler;
