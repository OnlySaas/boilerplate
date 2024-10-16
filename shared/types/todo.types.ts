import { Document } from "mongoose";
import { OrganizationTypes } from "./organization.types";
import { UserTypes } from "./user.types";
import { ApiTypes } from "./api.types";

export namespace TodoTypes {
  export enum TodoPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
  }

  export enum TodoStatus {
    PENDING = "pending",
    IN_PROGRESS = "in-progress",
    COMPLETED = "completed",
  }

  export interface TodoModel extends Document {
    _id: string;
    firstName?: string;
    name: string;
    description: string;
    isCompleted: boolean;
    dueDate: Date;
    priority: TodoPriority;
    status: TodoStatus;
    createdBy: UserTypes.UserModel;
    assignedTo: UserTypes.UserModel[];
    organization: OrganizationTypes.OrganizationModel;
  }

  export interface TodoDTO {
    _id: string;
    firstName?: string;
    lastName?: string;
    name: string;
    description: string;
    isCompleted: boolean;
    dueDate: Date;
    priority: TodoPriority;
    status: TodoStatus;
    createdBy: UserTypes.UserModel;
    assignedTo: UserTypes.UserModel[];
    organization: OrganizationTypes.OrganizationModel;
  }

  export interface CreateTodoRequest extends ApiTypes.QueryOptions {
    pathParams: { organizationId: string };
    body: {
      name: string;
      description: string;
      dueDate: Date;
      priority: TodoPriority;
      status: TodoStatus;
    };
  }

  export interface UpdateTodoRequest extends ApiTypes.QueryOptions {
    pathParams: { organizationId: string; todoId: string };
    body: {
      name: string;
      description: string;
      dueDate: Date;
      priority: TodoPriority;
      status: TodoStatus;
    };
  }

  export interface DeleteTodoRequest extends ApiTypes.QueryOptions {
    pathParams: { organizationId: string; todoId: string };
  }

  export interface GetTodoRequest extends ApiTypes.QueryOptions {
    pathParams: { organizationId: string; todoId: string };
  }

  export interface ListTodosRequest extends ApiTypes.QueryOptions {
    pathParams: { organizationId: string };
  }
}
