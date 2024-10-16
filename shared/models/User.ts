import mongoose, { Schema } from "mongoose";
import { UserTypes } from "../types";

const UserSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    resetToken: { type: String },
    resetTokenExpiry: { type: Number },
    organizations: [{ type: Schema.Types.ObjectId, ref: "Organization" }],
    selectedOrganizationId: { type: String, default: null },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

UserSchema.virtual("fullName").get(function (this: UserTypes.UserModel) {
  if (!this.firstName && !this.lastName) return "";
  return `${this.firstName} ${this.lastName}`.trim();
});

UserSchema.pre("save", function (this: UserTypes.UserModel, next) {
  this.fullName = `${this.firstName} ${this.lastName}`.trim();
  this.email = this.email.toLowerCase();
  next();
});

export const User = mongoose.model<UserTypes.UserModel>("User", UserSchema);

export async function getUserByEmail(
  email: string
): Promise<UserTypes.UserModel | null> {
  return User.findOne({ email });
}
