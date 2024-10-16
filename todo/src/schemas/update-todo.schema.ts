export const updateTodoParamsSchema = {
  type: "object",
  properties: {
    organizationId: { type: "string" },
    todoId: { type: "string" },
  },
  required: ["organizationId", "todoId"],
  additionalProperties: false,
} as const;

export const updateTodoBodySchema = {
  type: "object",
  properties: { name: { type: "string" } },
  required: ["name"],
  additionalProperties: false,
} as const;

export const updateTodoSchema = {
  type: "object",
  required: ["pathParameters", "body"],
  properties: {
    pathParameters: updateTodoParamsSchema,
    body: updateTodoBodySchema,
  },
};
