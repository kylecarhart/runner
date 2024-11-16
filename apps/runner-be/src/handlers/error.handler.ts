import type { ErrorHandler } from "hono";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { ApplicationError } from "../errors/ApplicationError.js";
import { HonoContext, HonoEnv } from "../index.js";

/**
 * Error middleware that handles application specific and unknown errors.
 * @returns Error middleware
 */
export const errorHandler: () => ErrorHandler<HonoEnv> = () => (err, c) => {
  // Application specific error
  if (err instanceof ApplicationError) {
    return handleApplicationError(err, c);
  }

  // Request validation error
  if (err instanceof ZodError) {
    return handleZodError(err, c);
  }

  // Unhandled error
  if (err instanceof Error) {
    return handleError(err, c);
  }

  // Unknown error
  return handleUnknownError(err, c);
};

/**
 * Handle an application specific error
 * @param c Koa context
 * @param err Application error
 */
function handleApplicationError(err: ApplicationError, c: HonoContext) {
  const { logger } = c.var;
  logger.error(err.stack);
  return c.json(err.getResponseBody(), err.httpStatusCode);
}

/**
 * Handle a Zod request validation error
 * @param c Koa context
 * @param err Zod validation error
 */
function handleZodError(err: ZodError, c: HonoContext) {
  const { logger } = c.var;
  logger.warn(err.flatten());
  return c.json(
    {
      success: false,
      code: "REQUEST_VALIDATION_ERROR",
      message: "The request could not be completed due to validation errors.",
      data: err.issues,
    },
    StatusCodes.BAD_REQUEST,
  );
}

/**
 * Handle an non-specific error
 * @param c Koa context
 * @param err Error
 */
function handleError(err: Error, c: HonoContext) {
  const { logger } = c.var;
  logger.error(err.stack);
  return c.json(
    {
      success: false,
      code: "ERROR",
      message: "An error occurred. Please try again.",
    },
    StatusCodes.INTERNAL_SERVER_ERROR,
  );
}

/**
 * Catch all for anything thrown that is not an instance of Error.
 * @param c Koa context
 */
function handleUnknownError(err: unknown, c: HonoContext) {
  const { logger } = c.var;
  logger.error(`Error of unknown type was thrown: ${err}`);
  return c.json(
    {
      success: false,
      code: "UNKNOWN_ERROR",
      message: "An unknown error occurred. Please try again.",
    },
    StatusCodes.INTERNAL_SERVER_ERROR,
  );
}
