import { User } from "@saas-boilerplate/shared";
import {
  middyfy,
  formatSuccessResponse,
  sendResponse,
  formatErrorResponse,
} from "@saas-boilerplate/shared";
import type { CustomHandler } from "@saas-boilerplate/shared/middyfy";
import connectDatabase from "@saas-boilerplate/shared/connection";
import { EventBridge } from "@aws-sdk/client-eventbridge";
import { Handler } from "aws-lambda";
import {
  forgotPasswordBodySchema,
  forgotPasswordSchema,
} from "../schemas/forgot-password.schema";
import { EmailParams } from "@saas-boilerplate/email/src/types";
import jwt from "jsonwebtoken";

const eventBridge = new EventBridge();

const forgotPasswordHandler: CustomHandler<
  typeof forgotPasswordBodySchema,
  { allowAuth: false }
> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const RESET_PASSWORD_TOKEN_SECRET: string = process.env
    .RESET_PASSWORD_TOKEN_SECRET as string;
  const FRONTEND_URL: string = process.env.FRONTEND_URL as string;

  const { email } = event.body;

  try {
    await connectDatabase();

    const user = await User.findOne({ email });

    if (!user)
      return sendResponse(
        200,
        formatSuccessResponse(
          null,
          "If a user with that email exists, a password reset link has been sent."
        )
      );

    const resetToken = jwt.sign(
      { userId: user._id },
      RESET_PASSWORD_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    const resetLink = `${FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

    const data: EmailParams = {
      to: user.email,
      templateName: "SaasBoilerplateForgotPasswordTemplate",
      templateData: {
        subject: "Password Reset Request",
        name: "User",
        resetLink,
      },
    };

    const params = {
      Entries: [
        {
          Source: "com.saas-boilerplate.user",
          DetailType: "ResetPasswordEmailRequest",
          Detail: JSON.stringify(data),
          EventBusName: "default",
        },
      ],
    };

    await eventBridge.putEvents(params);

    return sendResponse(
      200,
      formatSuccessResponse(
        null,
        "If a user with that email exists, a password reset link has been sent."
      )
    );
  } catch (error) {
    console.error("Error in forgot password process:", error);
    return sendResponse(
      500,
      formatErrorResponse("Failed to send password reset email", error.message)
    );
  }
};

export const handler = middyfy(forgotPasswordHandler, forgotPasswordSchema, {
  allowAuth: false,
}) as Handler;
