import jwt from "jsonwebtoken";
import { EventBridge } from "@aws-sdk/client-eventbridge";
import { UserTypes } from "@saas-boilerplate/shared";
import { EmailParams } from "@saas-boilerplate/email/src/types";

const eventBridge = new EventBridge();

export async function triggerVerificationEmail(
  user: UserTypes.UserModel
): Promise<void> {
  const VERIFICATION_TOKEN_SECRET: string = process.env
    .VERIFICATION_TOKEN_SECRET as string;
  const FRONTEND_URL: string = process.env.FRONTEND_URL as string;

  const token = jwt.sign({ userId: user._id }, VERIFICATION_TOKEN_SECRET, {
    expiresIn: "10m",
  });
  const verifyLink = `${FRONTEND_URL}/auth/verify-email?token=${token}`;

  const data: EmailParams = {
    to: user.email,
    templateName: "SaasBoilerplateVerifyEmailTemplate",
    templateData: {
      subject: "Verify Your Email Address",
      name: user.fullName,
      verifyLink,
    },
  };

  const params = {
    Entries: [
      {
        Source: "com.saas-boilerplate.user",
        DetailType: "VerificationEmailRequest",
        Detail: JSON.stringify(data),
        EventBusName: "default",
      },
    ],
  };

  try {
    await eventBridge.putEvents(params);
  } catch (error) {
    console.error("Failed to trigger verification email:", error);
    throw new Error("Failed to trigger verification email");
  }
}
