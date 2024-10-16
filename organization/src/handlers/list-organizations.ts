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

const listOrganizationsHandler: CustomHandler<null> = async (
  event,
  context
) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { userId } = event.auth.payload;

  try {
    await connectDatabase();
    const organizations = await Organization.find({
      members: { $elemMatch: { userId } },
    });

    return sendResponse(
      200,
      formatSuccessResponse(organizations, "Organizations fetched successfully")
    );
  } catch (error) {
    console.error(error);
    return sendResponse(
      500,
      formatErrorResponse("Failed to fetch organizations")
    );
  }
};

export const handler = middyfy(listOrganizationsHandler) as Handler;
