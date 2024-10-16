import { APIGatewayProxyHandler, EventBridgeEvent } from "aws-lambda";
import { EmailService } from "../services/email-service";
import { EmailParams } from "../types";

export const httpHandler: APIGatewayProxyHandler = async (event) => {
  try {
    const emailService = new EmailService();
    const emailParams: EmailParams = JSON.parse(event.body || "{}");

    await emailService.sendEmail(emailParams);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error sending email" }),
    };
  }
};

export const eventHandler = async (
  event: EventBridgeEvent<
    "VerificationEmailRequest" | "ResetPasswordEmailRequest",
    EmailParams
  >
) => {
  try {
    const emailService = new EmailService();
    console.log("event", event.detail);
    await emailService.sendEmail(event.detail);
    console.log(`${event["detail-type"]} sent successfully`);
  } catch (error) {
    console.error(`Error sending ${event["detail-type"]}:`, error);
    throw error; // This will cause the Lambda to retry
  }
};
