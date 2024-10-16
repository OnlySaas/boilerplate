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
  todoListParamsSchema,
  todoListSchema,
} from "../schemas/list-todos.schema";

const listTodosHandler: CustomHandler<
  null,
  typeof todoListParamsSchema
> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { organizationId } = event.pathParameters;

  try {
    await connectDatabase();
    const todos = await Todo.find({
      organization: organizationId,
    });

    return sendResponse(
      200,
      formatSuccessResponse(todos, "Todos fetched successfully")
    );
  } catch (error) {
    console.error(error);
    return sendResponse(500, formatErrorResponse("Failed to fetch todos"));
  }
};

export const handler = middyfy(listTodosHandler, todoListSchema) as Handler;
