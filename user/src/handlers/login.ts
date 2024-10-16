import { Handler } from "aws-lambda";
import {
  CustomHandler,
  User,
  UserTypes,
  formatErrorResponse,
  formatSuccessResponse,
  middyfy,
  sendResponse,
} from "@saas-boilerplate/shared";
import { loginBodySchema, loginSchema } from "../schemas/login.schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDatabase from "@saas-boilerplate/shared/connection";

const loginHandler: CustomHandler<
  typeof loginBodySchema,
  { allowAuth: false }
> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { email, password } = event.body;
  const SHARED_TOKEN_SECRET: string = process.env.SHARED_TOKEN_SECRET as string;
  try {
    await connectDatabase();
    const user = await User.findOne({ email }).populate("organizations");
    if (!user)
      return sendResponse(
        404,
        formatErrorResponse("Invalid email or password")
      );

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid)
      return sendResponse(
        404,
        formatErrorResponse("Invalid email or password")
      );

    console.log(user);

    if (!user.isEmailVerified)
      return sendResponse(
        403,
        formatErrorResponse(
          "Email not verified. Please check your email to verify your account."
        )
      );

    /**
     * The user is authenticated successfully, and we can generate a JWT token
     * to send in response to the client, with the email address and userId.
     */
    const token = jwt.sign({ email, userId: user._id }, SHARED_TOKEN_SECRET, {
      expiresIn: "1w",
    });

    const response: UserTypes.UserAuthResponse = {
      token,
    };

    return sendResponse(
      200,
      formatSuccessResponse(response, "User logged in successfully")
    );
  } catch (error) {
    return sendResponse(500, formatErrorResponse("Could not log in", error));
  }
};

export const handler = middyfy(loginHandler, loginSchema, {
  allowAuth: false,
}) as Handler;
