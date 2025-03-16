import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { ApplicationError } from "../errors/ApplicationError.js";
import { ZodResponseError } from "../errors/ZodResponseError.js";
import { HonoContext, HonoEnv } from "../index.js";

/**
 * Error middleware that handles application specific and unknown errors.
 * @returns Error middleware
 */
export const errorHandler: () => ErrorHandler<HonoEnv> = () => (err, c) => {
  // Handle HTTP Exception Errors
  if (err instanceof HTTPException) {
    return c.text(err.message, err.status);
  }

  // Application specific error
  if (err instanceof ApplicationError) {
    return handleApplicationError(err, c);
  }

  // Response validation error
  if (err instanceof ZodResponseError) {
    return handleResValidationError(err, c);
  }

  // Request validation error
  if (err instanceof ZodError) {
    return handleReqValidationError(err, c);
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
function handleReqValidationError(err: ZodError, c: HonoContext) {
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
 * Handle a Zod response validation error
 * @param c Koa context
 * @param err Zod validation error
 */
function handleResValidationError(err: ZodResponseError, c: HonoContext) {
  const { logger } = c.var;
  logger.error(err.flatten());
  return c.json(
    {
      success: false,
      code: "DEV_RESPONSE_VALIDATION_ERROR",
      message:
        "Response validation failed: While the operation may have completed successfully, the response structure does not match the OpenAPI/Zod schema. This is a development error that must be fixed before production deployment.",
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
