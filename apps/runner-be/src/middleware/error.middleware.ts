import { BaseContext, Next } from "koa";
import { logger } from "../utils/logger";

/**
 * Error middleware
 * @returns Error middleware
 */
export const errorMiddleware = () => async (ctx: BaseContext, next: Next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.stack);
      ctx.body = {
        message: err.message,
      };
    } else {
      logger.error(err);
    }

    ctx.status = 500;
  }
};
