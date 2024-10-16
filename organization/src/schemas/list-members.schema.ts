export const organizationMemberListParamsSchema = {
  type: "object",
  properties: { organizationId: { type: "string" } },
  required: ["organizationId"],
  additionalProperties: false,
} as const;

export const organizationMemberListSchema = {
  type: "object",
  required: ["pathParameters"],
  properties: { pathParameters: organizationMemberListParamsSchema },
};
