export const pendingInvitationRevokeParamsSchema = {
  type: "object",
  properties: {
    organizationId: { type: "string" },
    invitationId: { type: "string" },
  },
  required: ["organizationId", "invitationId"],
  additionalProperties: false,
} as const;

export const pendingInvitationRevokeSchema = {
  type: "object",
  required: ["pathParameters"],
  properties: {
    pathParameters: pendingInvitationRevokeParamsSchema,
  },
};
