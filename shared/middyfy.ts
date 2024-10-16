import middy, { MiddyfiedHandler } from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import cors from "@middy/http-cors";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import httpEventNormalizer from "@middy/http-event-normalizer";

import type {
  APIGatewayProxyEvent as ProxyEvent,
  APIGatewayProxyResult,
  Context,
  Handler as AWSHandler,
} from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";
import {
  JWTAuthMiddleware,
  EncryptionAlgorithms,
  IAuthorizedEvent,
} from "middy-middleware-jwt-auth";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import createHttpError from "http-errors";
import { formatErrorResponse, sendResponse } from "./response";

// Optionally define the token payload you expect to receive
interface ITokenPayload {
  userId: string;
  email: string;
}

// Optionally define a type guard for the token payload
function isTokenPayload(token: any): token is ITokenPayload {
  return (
    token != null &&
    typeof token.userId === "string" &&
    typeof token.email === "string"
  );
}

// Taken from https://github.com/middyjs/middy/issues/316#issuecomment-1013351805
// Event is an APIGatewayProxyEvent with a typed body, pathParameters and queryStringParameters which depends on http-json-body-parser & json-schema-to-ts
// queryStringParameters and multiValueQueryStringParameters is non-nullable as we use http-event-normalizer
export interface Event<
  TBody extends Record<string, unknown> | null,
  TPathParameters extends Record<string, unknown> | null,
  TQueryStringParameters extends Record<string, unknown> | null
> extends Omit<
    ProxyEvent,
    "body" | "pathParameters" | "queryStringParameters"
  > {
  body: TBody extends Record<string, unknown> ? FromSchema<TBody> : null;
  pathParameters: TPathParameters extends Record<string, unknown>
    ? FromSchema<TPathParameters>
    : null;
  queryStringParameters: TQueryStringParameters extends Record<string, unknown>
    ? FromSchema<TQueryStringParameters>
    : null;
  multiValueQueryStringParameters: NonNullable<
    ProxyEvent["multiValueQueryStringParameters"]
  >;
}

// We are making use of http-response-serializer
interface Result extends Omit<APIGatewayProxyResult, "body"> {
  body: string | Record<string, unknown>;
}

// Handler type which gives us proper types on our event based on TBody and TPathParameters which are JSON schemas
export type CustomHandler<
  TBody extends Record<string, unknown> | null = null,
  TPathParameters extends Record<string, unknown> | null = null,
  TQueryStringParameters extends Record<string, unknown> | null = null,
  TOptions extends { allowAuth: boolean } = { allowAuth: true }
> = (
  event: Event<TBody, TPathParameters, TQueryStringParameters> &
    (TOptions["allowAuth"] extends true ? IAuthorizedEvent<ITokenPayload> : {}),
  context: Context
) => Promise<Result> | Result;

const customErrorHandler = (): middy.MiddlewareObj<any, any> => {
  return {
    onError: async (request) => {
      const { error } = request;

      // Convert error to HttpError if it's not already
      if (!createHttpError.isHttpError(error)) {
        request.error = createHttpError(
          500,
          error?.message || "Internal server error"
        );
      }

      const httpError = request.error as createHttpError.HttpError;
      const errorResponse = formatErrorResponse(httpError.message);
      const response = sendResponse(httpError.statusCode || 500, errorResponse);

      console.log(response);
      request.response = response;
    },
  };
};

// TODO: find a way to remove the couple of `any` here. Validation and typing are still working though
export const middyfy = (
  handler: any,
  schema: Record<string, unknown> | null = null,
  options: { allowAuth: boolean } = { allowAuth: true }
): MiddyfiedHandler<Event<never, never, never>, Result, Error, Context> => {
  const wrapper: any = middy(handler)
    .use(httpHeaderNormalizer())
    .use(httpEventNormalizer())
    .use(cors())
    .use(middyJsonBodyParser({ disableContentTypeError: true }));

  if (schema) {
    wrapper.use(validator({ eventSchema: transpileSchema(schema) }));
  }

  if (options.allowAuth) {
    wrapper.use(
      new JWTAuthMiddleware({
        algorithm: EncryptionAlgorithms.HS256,
        credentialsRequired: true,
        isPayload: isTokenPayload,
        secretOrPublicKey: process.env.SHARED_TOKEN_SECRET as string,
      })
    );
  }

  return wrapper.use(customErrorHandler());
};
