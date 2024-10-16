import { User } from "@saas-boilerplate/shared/models";
import {
  middyfy,
  formatErrorResponse,
  formatSuccessResponse,
  sendResponse,
} from "@saas-boilerplate/shared";
import type { CustomHandler } from "@saas-boilerplate/shared/middyfy";
import { Handler } from "aws-lambda";
import jwt from "jsonwebtoken";
import {
  verifyEmailBodySchema,
  verifyEmailSchema,
} from "../schemas/verify-email.schema";
import connectDatabase from "@saas-boilerplate/shared/connection";

const verifyEmailHandler: CustomHandler<
  typeof verifyEmailBodySchema,
  { allowAuth: false }
> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const VERIFICATION_TOKEN_SECRET: string = process.env
    .VERIFICATION_TOKEN_SECRET as string;

  const token = event.body.token;

  if (!token) {
    return sendResponse(
      400,
      formatErrorResponse("Verification token is missing")
    );
  }

  try {
    await connectDatabase();

    // Verify the token
    const decodedToken = jwt.verify(token, VERIFICATION_TOKEN_SECRET) as {
      userId: string;
    };

    // Find the user
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return sendResponse(404, formatErrorResponse("User not found"));
    }

    if (user.isEmailVerified)
      return sendResponse(
        200,
        formatSuccessResponse({ message: "Email already verified" })
      );

    // Update user's verification status
    user.isEmailVerified = true;
    await user.save();

    return sendResponse(
      200,
      formatSuccessResponse({
        message: "Email verified successfully",
      })
    );
  } catch (error) {
    return sendResponse(
      500,
      formatErrorResponse("Failed to verify email", error.message)
    );
  }
};

export const handler = middyfy(verifyEmailHandler, verifyEmailSchema, {
  allowAuth: false,
}) as Handler;
