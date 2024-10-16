import { SendEmailCommandInput } from "@aws-sdk/client-ses";

export type TemplateName =
  | "SaasBoilerplateForgotPasswordTemplate"
  | "SaasBoilerplateVerifyEmailTemplate"
  | "SaasBoilerplateInviteMemberTemplate";

export interface EmailParams {
  to: string;
  templateName: TemplateName;
  templateData: {
    subject: string;
  } & Record<string, any>;
}

export type SESEmailParams = SendEmailCommandInput;
