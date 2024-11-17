import { createMiddleware } from "hono/factory";
import { HonoEnv } from "../index.js";
import { createLogger } from "../utils/logger.js";

/**
 * Logger middleware that creates a logger and sets it in the context.
 * @returns Hono logger middleware
 */
export const loggerMiddleware = () =>
  createMiddleware<HonoEnv>(async (c, next) => {
    const logger = createLogger(c.env); // Create logger for app
    c.set("logger", logger); // Set the logger in context
    await next();
  });
