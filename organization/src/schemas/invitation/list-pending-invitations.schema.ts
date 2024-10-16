export const pendingInvitationListParamsSchema = {
  type: "object",
  properties: { organizationId: { type: "string" } },
  required: ["organizationId"],
  additionalProperties: false,
} as const;

export const pendingInvitationListSchema = {
  type: "object",
  required: ["pathParameters"],
  properties: { pathParameters: pendingInvitationListParamsSchema },
};
