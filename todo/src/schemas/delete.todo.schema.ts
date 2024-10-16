export const deleteTodoParamsSchema = {
  type: "object",
  properties: {
    organizationId: { type: "string" },
    todoId: { type: "string" },
  },
  required: ["organizationId", "todoId"],
  additionalProperties: false,
} as const;

export const deleteTodoSchema = {
  type: "object",
  required: ["pathParameters"],
  properties: { pathParameters: deleteTodoParamsSchema },
};
