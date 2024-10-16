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
  updateTodoBodySchema,
  updateTodoParamsSchema,
  updateTodoSchema,
} from "../schemas/update-todo.schema";

const updateTodoHandler: CustomHandler<
  typeof updateTodoBodySchema,
  typeof updateTodoParamsSchema
> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { organizationId, todoId } = event.pathParameters;
  const { name } = event.body;
  try {
    await connectDatabase();

    const todo = await Todo.findOne({
      _id: todoId,
      organization: organizationId,
    });

    if (!todo) return sendResponse(404, formatErrorResponse("Todo not found"));

    todo.name = name;
    await todo.save();

    return sendResponse(
      200,
      formatSuccessResponse(todo, "Todo updated successfully")
    );
  } catch (error) {
    console.error(error);
    return sendResponse(500, formatErrorResponse("Failed to update todo"));
  }
};

export const handler = middyfy(updateTodoHandler, updateTodoSchema) as Handler;
