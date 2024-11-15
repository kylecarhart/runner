import { createMiddleware } from "hono/factory";
import { HonoEnv } from "../index.js";
import { createLogger } from "../utils/logger.js";

/**
 * Logger middleware
 * @returns Hono middleware
 */
export const loggerMiddleware = () =>
  createMiddleware<HonoEnv>(async (c, next) => {
    const logger = createLogger(c.env); // Create logger for app
    c.set("logger", logger); // Set the logger in context

    // TODO: Not sure if we need this anymore...
    // const start = Date.now();
    // try {
    //   await next();
    //   const ms = Date.now() - start;
    //   logger.info(`${c.req.method} ${c.req.url} - ${ms}ms`);
    // } catch (e) {
    //   const ms = Date.now() - start;
    //   logger.error(`${c.req.method} ${c.req.url} - ${ms}ms`);
    //   throw e;
    // }

    await next();
  });
