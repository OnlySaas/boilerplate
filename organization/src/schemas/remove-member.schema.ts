export const removeMemberRoleParamsSchema = {
  type: "object",
  properties: {
    organizationId: { type: "string" },
    memberId: { type: "string" },
  },
  required: ["organizationId", "memberId"],
  additionalProperties: false,
} as const;

export const removeMemberRoleSchema = {
  type: "object",
  required: ["pathParameters"],
  properties: { pathParameters: removeMemberRoleParamsSchema },
};
