import { ErrorResponse } from "@runner/api";
import { StatusCodes } from "http-status-codes";
import { DefaultContext, DefaultState, Next, ParameterizedContext } from "koa";
import { ZodError } from "zod";
import { ApplicationError } from "../errors/ApplicationError.ts";
import { logger } from "../utils/logger.ts";

/**
 * Gives type safety for setting the error response body.
 */
type ErrorContext = ParameterizedContext<
  DefaultContext,
  DefaultState,
  ErrorResponse
>;

/**
 * Error middleware
 * @returns Error middleware
 */
export const errorMiddleware = () => async (ctx: ErrorContext, next: Next) => {
  try {
    await next();
  } catch (err) {
    // Application specific error
    if (err instanceof ApplicationError) {
      return handleApplicationError(ctx, err);
    }

    // Request validation error
    if (err instanceof ZodError) {
      return handleZodError(ctx, err);
    }

    // Unhandled error
    if (err instanceof Error) {
      return handleError(ctx, err);
    }

    // Unknown error
    return handleUnknownError(ctx, err);
  }
};

/**
 * Handle an application specific error
 * @param ctx Koa context
 * @param err Application error
 */
function handleApplicationError(ctx: ErrorContext, err: ApplicationError) {
  logger.error(err.logMessage);
  ctx.body = err.getResponseBody();
  ctx.status = err.httpStatusCode;
}

/**
 * Handle a Zod request validation error
 * @param ctx Koa context
 * @param err Zod validation error
 */
function handleZodError(ctx: ErrorContext, err: ZodError) {
  logger.warn(err.flatten());
  ctx.body = {
    success: false,
    code: "REQUEST_VALIDATION_ERROR",
    message: "The request could not be completed due to validation errors.",
    data: err.issues,
  };
  ctx.status = StatusCodes.BAD_REQUEST;
}

/**
 * Handle an non-specific error
 * @param ctx Koa context
 * @param err Error
 */
function handleError(ctx: ErrorContext, err: Error) {
  logger.error(err.stack);
  ctx.body = {
    success: false,
    code: "ERROR",
    message: "An error occurred. Please try again.",
  };
  ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
}

/**
 * Catch all for anything thrown that is not an instance of Error.
 * @param ctx Koa context
 */
function handleUnknownError(ctx: ErrorContext, err: unknown) {
  logger.error(`Error of unknown type was thrown: ${err}`);
  ctx.body = {
    success: false,
    code: "UNKNOWN_ERROR",
    message: "An unknown error occurred. Please try again.",
  };
  ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
}
