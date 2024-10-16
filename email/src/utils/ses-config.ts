import { SESClientConfig } from "@aws-sdk/client-ses";

export const sesConfig: SESClientConfig = {
  region: process.env.SES_REGION,
};
