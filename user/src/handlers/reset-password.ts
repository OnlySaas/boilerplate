import {
  middyfy,
  formatErrorResponse,
  sendResponse,
  formatSuccessResponse,
  User,
} from "@saas-boilerplate/shared";
import type { CustomHandler } from "@saas-boilerplate/shared/middyfy";
import connectDatabase from "@saas-boilerplate/shared/connection";
import bcrypt from "bcryptjs";
import {
  resetPasswordBodySchema,
  resetPasswordSchema,
} from "../schemas/reset-password.schema";
import { Handler } from "aws-lambda";

const resetPasswordHandler: CustomHandler<
  typeof resetPasswordBodySchema,
  { allowAuth: false }
> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { token, newPassword } = event.body;

  try {
    await connectDatabase();

    // Find the user with the given reset token and check if it's still valid
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user)
      return sendResponse(
        400,
        formatErrorResponse("Invalid or expired reset token")
      );

    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update user's password and clear the reset token
    user.passwordHash = passwordHash;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return sendResponse(
      200,
      formatSuccessResponse(user, "Password reset successfully")
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return sendResponse(
      500,
      formatErrorResponse("Failed to reset password", error.message)
    );
  }
};

export const handler = middyfy(resetPasswordHandler, resetPasswordSchema, {
  allowAuth: false,
}) as Handler;
