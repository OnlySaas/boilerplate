import { Handler } from "aws-lambda";
import {
  CustomHandler,
  formatErrorResponse,
  formatSuccessResponse,
  middyfy,
  sendResponse,
  User,
} from "@saas-boilerplate/shared";
import { triggerVerificationEmail } from "../utils/trigger-verification-email";
import {
  resendVerificationEmailBodySchema,
  resendVerificationEmailSchema,
} from "../schemas/resend-verification-email.schema";
import connectDatabase from "@saas-boilerplate/shared/connection";

const resendVerificationEmailHandler: CustomHandler<
  typeof resendVerificationEmailBodySchema,
  { allowAuth: false }
> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { email } = event.body;

  try {
    await connectDatabase();

    const user = await User.findOne({ email });

    if (!user) return sendResponse(400, formatErrorResponse("User not found"));

    if (user.isEmailVerified)
      return sendResponse(400, formatErrorResponse("User is already verified"));

    await triggerVerificationEmail(user);

    return sendResponse(
      200,
      formatSuccessResponse(
        null,
        "If a user with that email exists, a password reset link has been sent."
      )
    );
  } catch (error) {
    console.error("Error resending verification email:", error);
    return sendResponse(
      500,
      formatErrorResponse("Error resending verification email")
    );
  }
};

export const handler = middyfy(
  resendVerificationEmailHandler,
  resendVerificationEmailSchema,
  {
    allowAuth: false,
  }
) as Handler;
