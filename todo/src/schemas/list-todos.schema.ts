export const todoListParamsSchema = {
  type: "object",
  properties: { organizationId: { type: "string" } },
  required: ["organizationId"],
  additionalProperties: false,
} as const;

export const todoListSchema = {
  type: "object",
  required: ["pathParameters"],
  properties: { pathParameters: todoListParamsSchema },
};
