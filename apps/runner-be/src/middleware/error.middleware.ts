import { StatusCodes } from "http-status-codes";
import { Context, Next } from "koa";
import { ZodError } from "zod";
import { ApplicationError } from "../errors/ApplicationError";
import { logger } from "../utils/logger";

/**
 * Error middleware
 * @returns Error middleware
 */
export const errorMiddleware = () => async (ctx: Context, next: Next) => {
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

    if (err instanceof Error) {
      return handleError(ctx, err);
    }

    return handleUnknownError(ctx);
  }
};

/**
 * Handle an application specific error
 * @param ctx Koa context
 * @param err Application error
 */
function handleApplicationError(ctx: Context, err: ApplicationError) {
  logger.error(err.logMessage);
  ctx.body = {
    message: err.apiMessage,
  };
  ctx.status = err.httpStatusCode;
}

/**
 * Handle a Zod request validation error
 * @param ctx Koa context
 * @param err Zod validation error
 */
function handleZodError(ctx: Context, err: ZodError) {
  logger.warn(err.flatten());
  ctx.body = {
    message: err.errors,
  };
  ctx.status = StatusCodes.BAD_REQUEST;
}

/**
 * Handle an non-specific error
 * @param ctx Koa context
 * @param err Error
 */
function handleError(ctx: Context, err: Error) {
  logger.error(err.stack);
  ctx.body = {
    message: err.message,
  };
  ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
}

/**
 * Catch all for anything thrown that is not an error.
 * @param ctx Koa context
 */
function handleUnknownError(ctx: Context) {
  ctx.body = {
    message: "An unknown error occurred",
  };
  ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
}
