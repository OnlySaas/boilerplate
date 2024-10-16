export const acceptInvitationParamsSchema = {
  type: "object",
  properties: { token: { type: "string" } },
  required: ["token"],
  additionalProperties: false,
} as const;

export const acceptInvitationSchema = {
  type: "object",
  required: ["pathParameters"],
  properties: { pathParameters: acceptInvitationParamsSchema },
};
