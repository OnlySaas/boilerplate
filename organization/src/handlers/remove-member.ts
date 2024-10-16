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
  removeMemberRoleParamsSchema,
  removeMemberRoleSchema,
} from "../schemas/remove-member.schema";

const removeMemberRoleHandler: CustomHandler<
  null,
  typeof removeMemberRoleParamsSchema
> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { organizationId, memberId } = event.pathParameters;

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
      { $pull: { members: { user: memberId } } }
    );

    await User.updateOne(
      { _id: memberId },
      { $pull: { organizations: organizationId } }
    );

    return sendResponse(
      200,
      formatSuccessResponse(null, "Member removed successfully")
    );
  } catch (error) {
    console.error(error);
    return sendResponse(500, formatErrorResponse("Error removing member"));
  }
};

export const handler = middyfy(
  removeMemberRoleHandler,
  removeMemberRoleSchema
) as Handler;
