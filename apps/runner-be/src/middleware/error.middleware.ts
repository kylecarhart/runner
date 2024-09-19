import { Context, Next } from "koa";
import { ZodError } from "zod";
import { logger } from "../utils/logger";

/**
 * Error middleware
 * @returns Error middleware
 */
export const errorMiddleware = () => async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
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
 * Handle a Zod validation error
 * @param ctx Koa context
 * @param err Zod validation error
 */
function handleZodError(ctx: Context, err: ZodError) {
  logger.warn(err.flatten());
  ctx.body = {
    message: err.errors,
  };
  ctx.status = 400;
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
  ctx.status = 500;
}

/**
 * Catch all for anything thrown that is not an error.
 * @param ctx Koa context
 */
function handleUnknownError(ctx: Context) {
  ctx.body = {
    message: "An unknown error occurred",
  };
  ctx.status = 500;
}
