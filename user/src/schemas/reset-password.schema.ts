export const resetPasswordBodySchema = {
  type: "object",
  properties: { token: { type: "string" }, newPassword: { type: "string" } },
  required: ["token", "newPassword"],
  additionalProperties: false,
} as const;

export const resetPasswordSchema = {
  type: "object",
  required: ["body"],
  properties: { body: resetPasswordBodySchema },
};
