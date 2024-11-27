import { env as envAdapter } from "hono/adapter";
import { getContext } from "hono/context-storage";
import { z } from "zod";
import { HonoEnv } from "../index.js";

/**
 * Schema that validates environment variables for safe usage.
 * Log level is set to "info" by default.
 */
export const EnvSchema = z
  .object({
    // Environment
    ENVIRONMENT: z.enum(["development", "production"]),
    LOG_LEVEL: z
      .enum(["trace", "debug", "info", "warn", "error", "fatal"])
      .default("info"),
    // Server
    PORT: z.coerce.number(),
    ALLOWED_ORIGIN: z.string(),
    // Database
    DB_HOST: z.string(),
    DB_PORT_TRANSACTION: z.coerce.number(),
    DB_PORT_SESSION: z.coerce.number(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
  })
  .strict();

/**
 * Environment from context.
 * @see https://hono.dev/docs/helpers/adapter
 * @returns Environment
 */
export const env = () => envAdapter(getContext<HonoEnv>());

/**
 * Check if the environment is development.
 * @returns True if development environment, false otherwise
 */
export function isDevelopment() {
  return ENVIRONMENT === "development";
}

// export const Env = EnvSchema.parse(process.env);
export type Env = z.infer<typeof EnvSchema>;
