import { getContext } from "hono/context-storage";
import { Logger, pino } from "pino";
import { HonoEnv } from "../index.js";
import { Env } from "./env.js";

/**
 * Create a logger. This should only be used once in the app.
 * @param env - Environment variables
 * @returns Logger
 */
export function createLogger(env: Env): Logger {
  return pino({
    browser: { asObject: true },
    level: env.LOG_LEVEL,
  });
}

/**
 * Logger from context.
 * @returns Logger
 */
export const logger = () => getContext<HonoEnv>().var.logger;
