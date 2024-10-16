import mongoose, { Schema } from "mongoose";
import { TodoTypes } from "../types";

const TodoSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    description: { type: String },
    isCompleted: { type: Boolean, default: false },
    dueDate: { type: Date },
    priority: {
      type: String,
      enum: Object.values(TodoTypes.TodoPriority),
      default: TodoTypes.TodoPriority.MEDIUM,
    },
    status: {
      type: String,
      enum: Object.values(TodoTypes.TodoStatus),
      default: TodoTypes.TodoStatus.PENDING,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: "User" }],
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export const Todo = mongoose.model<TodoTypes.TodoModel>("Todo", TodoSchema);
