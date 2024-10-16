export const forgotPasswordBodySchema = {
  type: "object",
  properties: { email: { type: "string" } },
  required: ["email"],
  additionalProperties: false,
} as const;

export const forgotPasswordSchema = {
  type: "object",
  required: ["body"],
  properties: { body: forgotPasswordBodySchema },
};
