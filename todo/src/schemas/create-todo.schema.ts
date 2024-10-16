import { TodoTypes } from "@saas-boilerplate/shared";

export const createTodoBodySchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    dueDate: { type: "string" },
    priority: {
      type: "string",
      enum: Object.values(TodoTypes.TodoPriority),
    },
    status: {
      type: "string",
      enum: Object.values(TodoTypes.TodoStatus),
    },
  },
  required: ["name", "description", "dueDate", "priority", "status"],
  additionalProperties: false,
} as const;

export const createTodoParamsSchema = {
  type: "object",
  properties: { organizationId: { type: "string" } },
  required: ["organizationId"],
  additionalProperties: false,
} as const;

export const createTodoSchema = {
  type: "object",
  required: ["body", "pathParameters"],
  properties: {
    body: createTodoBodySchema,
    pathParameters: createTodoParamsSchema,
  },
};
