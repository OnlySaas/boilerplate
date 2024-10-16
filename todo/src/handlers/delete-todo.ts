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
  deleteTodoParamsSchema,
  deleteTodoSchema,
} from "../schemas/delete.todo.schema";

const deleteTodoHandler: CustomHandler<
  null,
  typeof deleteTodoParamsSchema
> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { organizationId, todoId } = event.pathParameters;

  try {
    await connectDatabase();

    const todo = await Todo.findOneAndDelete({
      _id: todoId,
      organization: organizationId,
    });

    if (!todo) return sendResponse(404, formatErrorResponse("Todo not found"));

    return sendResponse(
      200,
      formatSuccessResponse(todo, "Todo deleted successfully")
    );
  } catch (error) {
    console.error(error);
    return sendResponse(500, formatErrorResponse("Failed to delete todo"));
  }
};

export const handler = middyfy(deleteTodoHandler, deleteTodoSchema) as Handler;
