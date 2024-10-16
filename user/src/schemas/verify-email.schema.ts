export const verifyEmailBodySchema = {
  type: "object",
  properties: {
    token: { type: "string" },
  },
  required: ["token"],
  additionalProperties: false,
} as const;

export const verifyEmailSchema = {
  type: "object",
  required: ["body"],
  properties: {
    body: verifyEmailBodySchema,
    // possible to add pathParameters and queryStringParameters validation
    // pathParameters: pathSchema,
    // queryStringParameters: queryStringSchema
  },
};
