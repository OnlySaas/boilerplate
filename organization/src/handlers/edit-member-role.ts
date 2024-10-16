import {
  CustomHandler,
  formatErrorResponse,
  formatSuccessResponse,
  middyfy,
  Organization,
  sendResponse,
} from "@saas-boilerplate/shared";
import connectDatabase from "@saas-boilerplate/shared/connection";
import { Handler } from "aws-lambda";
import {
  editMemberRoleBodySchema,
  editMemberRoleParamsSchema,
  editMemberRoleSchema,
} from "../schemas/edit-member-role.schema";

const editMemberRoleHandler: CustomHandler<
  typeof editMemberRoleBodySchema,
  typeof editMemberRoleParamsSchema
> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { organizationId, memberId } = event.pathParameters;
  const { role } = event.body;

  if (!organizationId || !memberId)
    return sendResponse(
      400,
      formatErrorResponse("Organization id and member id are required")
    );

  try {
    await connectDatabase();

    const member = await Organization.findOne({
      _id: organizationId,
      "members.user": memberId,
    });

    if (!member)
      return sendResponse(
        400,
        formatErrorResponse("Member with this id does not exist")
      );

    await Organization.updateOne(
      { _id: organizationId, "members.user": memberId },
      { $set: { "members.$.role": role } }
    );

    return sendResponse(
      200,
      formatSuccessResponse(null, "Member role updated successfully")
    );
  } catch (error) {
    console.error(error);
    return sendResponse(500, formatErrorResponse("Error updating member role"));
  }
};

export const handler = middyfy(
  editMemberRoleHandler,
  editMemberRoleSchema
) as Handler;
