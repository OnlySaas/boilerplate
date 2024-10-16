import {
  formatErrorResponse,
  formatSuccessResponse,
  middyfy,
  Organization,
  sendResponse,
  User,
} from "@saas-boilerplate/shared";
import connectDatabase from "@saas-boilerplate/shared/connection";
import type { CustomHandler } from "@saas-boilerplate/shared/middyfy";
import { Handler } from "aws-lambda";
import bcrypt from "bcryptjs";
import { registerBodySchema, registerSchema } from "../schemas/register.schema";
import { triggerVerificationEmail } from "../utils/trigger-verification-email";

const registerHandler: CustomHandler<
  typeof registerBodySchema,
  { allowAuth: false }
> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { email, password } = event.body;

  try {
    await connectDatabase();
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return sendResponse(400, formatErrorResponse("User already exists"));

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      passwordHash,
      isEmailVerified: false,
    });

    // Create a organization for the user
    const organization = await Organization.create({
      name: `${email} Workspace`,
      description: "Your personal organization",
      members: [{ user: newUser, role: "owner", status: "accepted" }],
      owner: newUser,
    });

    // Add the organization to the user
    newUser.organizations.push(organization);
    await newUser.save();

    // Trigger verification email
    await triggerVerificationEmail(newUser);

    return sendResponse(
      200,
      formatSuccessResponse(
        null,
        "User created successfully. Please check your email to verify your account."
      )
    );
  } catch (error) {
    return sendResponse(
      500,
      formatErrorResponse("Failed to create user", error.message)
    );
  }
};

export const handler = middyfy(registerHandler, registerSchema, {
  allowAuth: false,
}) as Handler;
