import {
  CustomHandler,
  User,
  UserTypes,
  formatErrorResponse,
  formatSuccessResponse,
  middyfy,
  sendResponse,
} from "@saas-boilerplate/shared";
import connectDatabase from "@saas-boilerplate/shared/connection";
import { Handler } from "aws-lambda";

const currentUserHandler: CustomHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const userId = event.auth.payload.userId;
  try {
    await connectDatabase();
    const user = await User.findOne(
      { _id: userId },
      { passwordHash: 0 }
    ).populate({
      path: "organizations",
      populate: {
        path: "members",
        model: "Organization",
        populate: {
          path: "user",
          model: "User",
          select: "_id email firstName lastName fullName isEmailVerified",
        },
      },
    });

    if (!user) return sendResponse(404, formatErrorResponse("User not found"));

    const response: UserTypes.UserDTO = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      isEmailVerified: user.isEmailVerified,
      organizations: user.organizations,
      selectedOrganizationId: user.selectedOrganizationId,
    };

    return sendResponse(
      200,
      formatSuccessResponse(response, "User data fetched successfully")
    );
  } catch (error) {
    return sendResponse(
      500,
      formatErrorResponse("Failed to fetch user data", error.message)
    );
  }
};

export const handler = middyfy(currentUserHandler) as Handler;
