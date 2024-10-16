export const createOrganizationBodySchema = {
  type: "object",
  properties: { name: { type: "string" } },
  required: ["name"],
  additionalProperties: false,
} as const;

export const createOrganizationSchema = {
  type: "object",
  required: ["body"],
  properties: { body: createOrganizationBodySchema },
};
