export const editMemberRoleParamsSchema = {
  type: "object",
  properties: {
    organizationId: { type: "string" },
    memberId: { type: "string" },
  },
  required: ["organizationId", "memberId"],
  additionalProperties: false,
} as const;

export const editMemberRoleBodySchema = {
  type: "object",
  properties: { role: { enum: ["owner", "member", "admin"] } },
  required: ["role"],
  additionalProperties: false,
} as const;

export const editMemberRoleSchema = {
  type: "object",
  required: ["pathParameters", "body"],
  properties: {
    pathParameters: editMemberRoleParamsSchema,
    body: editMemberRoleBodySchema,
  },
};
