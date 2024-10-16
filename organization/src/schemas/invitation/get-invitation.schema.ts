export const getInvitationPathParamsSchema = {
  type: "object",
  properties: { token: { type: "string" } },
  required: ["token"],
  additionalProperties: false,
} as const;

export const getInvitationSchema = {
  type: "object",
  required: ["pathParameters"],
  properties: { pathParameters: getInvitationPathParamsSchema },
};
