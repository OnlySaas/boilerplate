import mongoose, { Schema } from "mongoose";
import { InvitationTypes } from "../types";
import { v4 as uuidv4 } from "uuid";

const InvitationSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    organization: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Organization",
    },
    email: { type: String, required: true },
    role: {
      type: String,
      enum: ["owner", "admin", "member"],
      default: "member",
    },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    sendAt: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    acceptedBy: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["pending", "accepted", "expired", "revoked"],
      default: "pending",
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export const Invitation = mongoose.model<InvitationTypes.InvitationModel>(
  "Invitation",
  InvitationSchema
);

export async function createInvitation(
  organizationId: string,
  email: string,
  role: string
): Promise<InvitationTypes.InvitationModel> {
  const token = uuidv4(); // Implement this function to generate a unique token
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

  return Invitation.create({
    organization: organizationId,
    email,
    role,
    token,
    expiresAt,
  });
}
