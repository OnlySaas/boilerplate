import {
  SESClient,
  SendTemplatedEmailCommand,
  SendTemplatedEmailCommandInput,
} from "@aws-sdk/client-ses";
// import { TemplateService } from "./template-service";
import { EmailParams } from "../types";
import { sesConfig } from "../utils/ses-config";

export class EmailService {
  private sesClient: SESClient;
  // private templateService: TemplateService;

  constructor() {
    this.sesClient = new SESClient(sesConfig);
    // this.templateService = new TemplateService();
  }

  async sendEmail(params: EmailParams): Promise<void> {
    const { to, templateName, templateData } = params;

    console.log("templateData", templateData);

    const emailParams: SendTemplatedEmailCommandInput = {
      Destination: { ToAddresses: [to] },
      Source: process.env.SES_SENDER_EMAIL!,
      Template: templateName,
      TemplateData: JSON.stringify(templateData),
    };

    try {
      const command = new SendTemplatedEmailCommand(emailParams);
      const response = await this.sesClient.send(command);
      console.log("Email sent successfully:", response.MessageId);
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
}
