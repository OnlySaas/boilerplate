import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TodoTypes, ApiTypes } from "@saas-boilerplate/shared/types";
import { apiClient } from "./client";
import { handleError } from "@/lib/error-handler";

export function useCreateTodo(args: TodoTypes.CreateTodoRequest) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiTypes.ApiResponse<TodoTypes.TodoDTO>,
    void,
    TodoTypes.CreateTodoRequest
  >({
    mutationKey: [
      "/todos/organizations/:organizationId",
      args.pathParams.organizationId,
    ],
    mutationFn: async (args: TodoTypes.CreateTodoRequest) => {
      const { data } = await apiClient.post<
        ApiTypes.ApiResponse<TodoTypes.TodoDTO>
      >(`/todos/organizations/${args.pathParams.organizationId}`, args.body);

      return data;
    },
    onSuccess: (data: ApiTypes.ApiResponse<TodoTypes.TodoDTO>) => {
      toast.success(data.message || "Todo created successfully");
      queryClient.invalidateQueries({
        queryKey: [
          "/todos/organizations/:organizationId",
          args.pathParams.organizationId,
        ],
      });
    },
    onError: (error) => handleError(error),
  });
}

export function useGetTodos(args: TodoTypes.ListTodosRequest) {
  return useQuery<ApiTypes.ApiResponse<TodoTypes.TodoDTO[]>>({
    queryKey: [
      "/todos/organizations/:organizationId",
      args.pathParams.organizationId,
    ],
    queryFn: async ({ queryKey }) => {
      const [, organizationId] = queryKey;
      try {
        const { data } = await apiClient.get<
          ApiTypes.ApiResponse<TodoTypes.TodoDTO[]>
        >(`/todos/organizations/${organizationId}`);

        return data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    enabled: !!args.pathParams.organizationId,
  });
}

export function useGetTodo(args: TodoTypes.GetTodoRequest) {
  return useQuery<ApiTypes.ApiResponse<TodoTypes.TodoDTO>, void>({
    queryKey: [
      "/todos/:todoId/organizations/:organizationId",
      args.pathParams.todoId,
      args.pathParams.organizationId,
    ],
    queryFn: async () => {
      const { data } = await apiClient.get<
        ApiTypes.ApiResponse<TodoTypes.TodoDTO>
      >(
        `/todos/${args.pathParams.todoId}/organizations/${args.pathParams.organizationId}`
      );

      return data;
    },
  });
}

export function useUpdateTodo(args: TodoTypes.UpdateTodoRequest) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiTypes.ApiResponse<TodoTypes.TodoDTO>,
    void,
    TodoTypes.UpdateTodoRequest
  >({
    mutationKey: ["/todos/:todoId/organizations/:organizationId"],
    mutationFn: async (args: TodoTypes.UpdateTodoRequest) => {
      const { data } = await apiClient.put<
        ApiTypes.ApiResponse<TodoTypes.TodoDTO>
      >(
        `/todos/${args.pathParams.todoId}/organizations/${args.pathParams.organizationId}`,
        args.body
      );

      return data;
    },
    onSuccess: (data: ApiTypes.ApiResponse<TodoTypes.TodoDTO>) => {
      toast.success(data.message || "Todo updated successfully");
      queryClient.invalidateQueries({
        queryKey: [
          "/todos/organizations/:organizationId",
          args.pathParams.organizationId,
        ],
      });
    },
    onError: (error) => handleError(error),
  });
}

export function useDeleteTodo(args: TodoTypes.DeleteTodoRequest) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiTypes.ApiResponse<TodoTypes.TodoDTO>,
    void,
    TodoTypes.DeleteTodoRequest
  >({
    mutationKey: ["/todos/:todoId/organizations/:organizationId"],
    mutationFn: async (args: TodoTypes.DeleteTodoRequest) => {
      const { data } = await apiClient.delete<
        ApiTypes.ApiResponse<TodoTypes.TodoDTO>
      >(
        `/todos/${args.pathParams.todoId}/organizations/${args.pathParams.organizationId}`
      );

      return data;
    },
    onSuccess: (data: ApiTypes.ApiResponse<TodoTypes.TodoDTO>) => {
      toast.success(data.message || "Todo deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [
          "/todos/organizations/:organizationId",
          args.pathParams.organizationId,
        ],
      });
    },
    onError: (error) => handleError(error),
  });
}
