import { ApiTypes } from "./types/api.types";

export const formatSuccessResponse = <T>(
  data: T,
  message: string = "Success"
): ApiTypes.ApiResponse<T> => {
  return {
    success: true,
    message,
    data,
  };
};

export const formatErrorResponse = (
  message: string,
  error: string = "Error"
): ApiTypes.ErrorResponse => {
  return {
    success: false,
    message,
    error,
  };
};

export const formatPaginatedResponse = <T>(
  data: T[],
  pagination: ApiTypes.PaginatedResponse<T>["pagination"],
  message: string = "Success"
): ApiTypes.PaginatedResponse<T> => {
  return {
    success: true,
    message,
    data,
    pagination,
  };
};

export const sendResponse = <T>(
  statusCode: number,
  body: ApiTypes.ApiResponse<T> | ApiTypes.ErrorResponse
) => {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
