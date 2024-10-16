export const registerBodySchema = {
  type: "object",
  properties: {
    email: { type: "string" },
    password: { type: "string" },
  },
  required: ["email", "password"],
  additionalProperties: false,
} as const;

export const registerSchema = {
  type: "object",
  required: ["body"],
  properties: {
    body: registerBodySchema,
    // possible to add pathParameters and queryStringParameters validation
    // pathParameters: pathSchema,
    // queryStringParameters: queryStringSchema
  },
};
