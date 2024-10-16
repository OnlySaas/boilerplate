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
import { getTodoParamsSchema, getTodoSchema } from "../schemas/get-todo.schema";

const getTodoHandler: CustomHandler<null, typeof getTodoParamsSchema> = async (
  event,
  context
) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { organizationId, todoId } = event.pathParameters;

  try {
    await connectDatabase();

    const todo = await Todo.findOne({
      _id: todoId,
      organization: organizationId,
    });

    if (!todo) return sendResponse(404, formatErrorResponse("Todo not found"));

    return sendResponse(
      200,
      formatSuccessResponse(todo, "Todo fetched successfully")
    );
  } catch (error) {
    console.error(error);
    return sendResponse(500, formatErrorResponse("Failed to fetch todo"));
  }
};

export const handler = middyfy(getTodoHandler, getTodoSchema) as Handler;
