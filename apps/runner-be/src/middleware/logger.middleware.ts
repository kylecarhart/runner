import type { Context, Next } from "hono";
import { logger } from "../utils/logger.js";

/**
 * Logger middleware
 * @returns Koa middleware
 */
export const loggerMiddleware = () => async (c: Context, next: Next) => {
  const start = Date.now();
  try {
    await next();
    const ms = Date.now() - start;
    logger.http(`${c.req.method} ${c.req.url} - ${ms}ms`);
  } catch (e) {
    const ms = Date.now() - start;
    logger.error(`${c.req.method} ${c.req.url} - ${ms}ms`);
    throw e;
  }
};
