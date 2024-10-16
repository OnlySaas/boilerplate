export const switchOrganizationParamsSchema = {
  type: "object",
  properties: { organizationId: { type: "string" } },
  required: ["organizationId"],
  additionalProperties: false,
} as const;

export const switchOrganizationSchema = {
  type: "object",
  required: ["pathParameters"],
  properties: { pathParameters: switchOrganizationParamsSchema },
};
