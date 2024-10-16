export const getTodoParamsSchema = {
  type: "object",
  properties: {
    organizationId: { type: "string" },
    todoId: { type: "string" },
  },
  required: ["organizationId", "todoId"],
  additionalProperties: false,
} as const;

export const getTodoSchema = {
  type: "object",
  required: ["pathParameters"],
  properties: { pathParameters: getTodoParamsSchema },
};
