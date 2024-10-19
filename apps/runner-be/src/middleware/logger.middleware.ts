import { Context, Next } from "koa";
import { logger } from "../utils/logger.ts";

/**
 * Logger middleware
 * @returns Koa middleware
 */
export const loggerMiddleware = () => async (ctx: Context, next: Next) => {
  const start = Date.now();
  try {
    await next();
    const ms = Date.now() - start;
    logger.http(`${ctx.method} ${ctx.url} - ${ms}ms`);
  } catch (e) {
    const ms = Date.now() - start;
    logger.error(`${ctx.method} ${ctx.url} - ${ms}ms`);
    throw e;
  }
};
