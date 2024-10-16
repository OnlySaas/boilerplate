import {
  formatErrorResponse,
  formatSuccessResponse,
  middyfy,
  sendResponse,
  User,
} from "@saas-boilerplate/shared";
import connectDatabase from "@saas-boilerplate/shared/connection";
import type { CustomHandler } from "@saas-boilerplate/shared/middyfy";
import { Handler } from "aws-lambda";
import {
  updateProfileBodySchema,
  updateProfileSchema,
} from "../schemas/update-profile.schema";

const updateProfileHandler: CustomHandler<
  typeof updateProfileBodySchema
> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { firstName, lastName } = event.body;
  const userId = event.auth.payload.userId;

  try {
    await connectDatabase();

    const user = await User.findByIdAndUpdate(userId, {
      firstName,
      lastName,
    }).select("-passwordHash -resetToken -resetTokenExpiry");

    return sendResponse(
      200,
      formatSuccessResponse(user, "Profile updated successfully")
    );
  } catch (error) {
    return sendResponse(
      500,
      formatErrorResponse("Failed to update profile", error.message)
    );
  }
};

export const handler = middyfy(
  updateProfileHandler,
  updateProfileSchema
) as Handler;
