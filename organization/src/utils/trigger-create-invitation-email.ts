import { OrganizationTypes, User } from "@saas-boilerplate/shared";
import jwt from "jsonwebtoken";
import { EventBridge } from "@aws-sdk/client-eventbridge";
import { UserTypes } from "@saas-boilerplate/shared";
import { EmailParams } from "@saas-boilerplate/email/src/types";

const eventBridge = new EventBridge();

export async function triggerCreateInvitationEmail(
  email: string,
  organization: OrganizationTypes.OrganizationModel,
  token: string
): Promise<void> {
  const FRONTEND_URL: string = process.env.FRONTEND_URL as string;

  const inviteLink = `${FRONTEND_URL}/accept-invitation/?token=${token}`;

  const data: EmailParams = {
    to: email,
    templateName: "SaasBoilerplateInviteMemberTemplate",
    templateData: {
      subject: "Invite to Organization",
      inviteLink,
      organizationName: organization.name,
    },
  };

  const params = {
    Entries: [
      {
        Source: "com.saas-boilerplate.user",
        DetailType: "InviteMemberEmailRequest",
        Detail: JSON.stringify(data),
        EventBusName: "default",
      },
    ],
  };

  try {
    await eventBridge.putEvents(params);
  } catch (error) {
    console.error("Failed to trigger invite member email:", error);
    throw new Error("Failed to trigger invite member email");
  }
}
