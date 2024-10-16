import mongoose, { Schema } from "mongoose";
import { OrganizationTypes } from "../types";

const OrganizationSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true, unique: true },
    owner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    members: [
      {
        user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        role: {
          type: String,
          enum: ["owner", "admin", "member"],
          default: "owner",
        },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export const Organization = mongoose.model<OrganizationTypes.OrganizationModel>(
  "Organization",
  OrganizationSchema
);

export async function createDefaultOrganization(
  userId: string
): Promise<OrganizationTypes.OrganizationModel> {
  return Organization.create({
    name: "Default Organization",
    userId,
  });
}
