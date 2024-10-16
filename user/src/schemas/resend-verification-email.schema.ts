export const resendVerificationEmailBodySchema = {
  type: "object",
  properties: {
    email: { type: "string" },
  },
  required: ["email"],
  additionalProperties: false,
} as const;

export const resendVerificationEmailSchema = {
  type: "object",
  required: ["body"],
  properties: {
    body: resendVerificationEmailBodySchema,
    // possible to add pathParameters and queryStringParameters validation
    // pathParameters: pathSchema,
    // queryStringParameters: queryStringSchema
  },
};
