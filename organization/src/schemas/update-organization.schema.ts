export const updateOrganizationBodySchema = {
  type: "object",
  properties: { name: { type: "string" } },
  required: ["name"],
  additionalProperties: false,
} as const;

export const updateOrganizationParamsSchema = {
  type: "object",
  properties: { organizationId: { type: "string" } },
  required: ["organizationId"],
  additionalProperties: false,
} as const;

export const updateOrganizationSchema = {
  type: "object",
  required: ["body", "pathParameters"],
  properties: {
    body: updateOrganizationBodySchema,
    pathParameters: updateOrganizationParamsSchema,
  },
};
