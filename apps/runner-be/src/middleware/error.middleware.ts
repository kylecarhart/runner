import type { Context, Next } from "@hono";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { ApplicationError } from "../errors/ApplicationError";
import { logger } from "../utils/logger";

/**
 * Error middleware
 * @returns Error middleware
 */
export const errorMiddleware = () => async (c: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
    // Application specific error
    if (err instanceof ApplicationError) {
      return handleApplicationError(c, err);
    }

    // Request validation error
    if (err instanceof ZodError) {
      return handleZodError(c, err);
    }

    // Unhandled error
    if (err instanceof Error) {
      return handleError(c, err);
    }

    // Unknown error
    return handleUnknownError(c, err);
  }
};

/**
 * Handle an application specific error
 * @param c Koa context
 * @param err Application error
 */
function handleApplicationError(c: Context, err: ApplicationError) {
  logger.error(err.logMessage);
  return c.json(err.getResponseBody(), err.httpStatusCode);
}

/**
 * Handle a Zod request validation error
 * @param c Koa context
 * @param err Zod validation error
 */
function handleZodError(c: Context, err: ZodError) {
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
function handleError(c: Context, err: Error) {
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
function handleUnknownError(c: Context, err: unknown) {
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
