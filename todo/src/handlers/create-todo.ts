import {
  CustomHandler,
  formatErrorResponse,
  formatSuccessResponse,
  middyfy,
  sendResponse,
  Todo,
} from "@saas-boilerplate/shared";
import connectDatabase from "@saas-boilerplate/shared/connection";
import { Handler } from "aws-lambda";
import {
  createTodoBodySchema,
  createTodoParamsSchema,
  createTodoSchema,
} from "../schemas/create-todo.schema";

const createTodoHandler: CustomHandler<
  typeof createTodoBodySchema,
  typeof createTodoParamsSchema
> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { userId } = event.auth.payload;
  const { organizationId } = event.pathParameters;
  const { name, description, dueDate, priority, status } = event.body;
  try {
    await connectDatabase();

    const existingTodo = await Todo.findOne({
      name,
      organization: organizationId,
    });

    if (existingTodo)
      return sendResponse(
        400,
        formatErrorResponse("Todo with this name already exists")
      );

    const todo = await Todo.create({
      name,
      description,
      dueDate,
      priority,
      status,
      assignedTo: [],
      createdBy: userId,
      organization: organizationId,
    });

    return sendResponse(
      200,
      formatSuccessResponse(todo, "Todo created successfully")
    );
  } catch (error) {
    console.error(error);
    return sendResponse(500, formatErrorResponse("Error creating todo"));
  }
};

export const handler = middyfy(createTodoHandler, createTodoSchema) as Handler;
