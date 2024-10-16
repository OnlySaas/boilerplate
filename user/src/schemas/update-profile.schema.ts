export const updateProfileBodySchema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
  },
  required: ["firstName", "lastName"],
  additionalProperties: false,
} as const;

export const updateProfileSchema = {
  type: "object",
  required: ["body"],
  properties: {
    body: updateProfileBodySchema,
    // possible to add pathParameters and queryStringParameters validation
    // pathParameters: pathSchema,
    // queryStringParameters: queryStringSchema
  },
};
