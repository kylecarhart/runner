import { env as envAdapter } from "hono/adapter";
import { getContext } from "hono/context-storage";
import { z } from "zod";
import { HonoEnv } from "../index.js";

/**
 * Schema that validates environment variables for safe usage.
 * Log level is set to "info" by default.
 */
const EnvSchema = z.object({
  // Environment
  ENVIRONMENT: z.enum(["development", "production"]),
  LOG_LEVEL: z
    .enum(["error", "warn", "info", "http", "verbose", "debug", "silly"])
    .default("info"),
  // Server
  PORT: z.coerce.number(),
  // Database
  DB_HOST: z.string(),
  DB_PORT_TRANSACTION: z.coerce.number(),
  DB_PORT_SESSION: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  // OpenAPI
  PATH_DOCS: z.string(),
  PATH_SWAGGER: z.string(),
  PATH_SCALAR: z.string(),
  PATH_OPENAPI: z.string(),
  // Auth
  JWT_SECRET: z.string(),
});

/**
 * Environment from context.
 * @see https://hono.dev/docs/helpers/adapter
 * @returns Environment
 */
export const env = () => envAdapter(getContext<HonoEnv>());

/**
 * Check if development environment. Must be used within app context.
 * @returns True if development environment, false otherwise
 */
export function isDevelopment() {
  return env().ENVIRONMENT === "development";
}

// export const Env = EnvSchema.parse(process.env);
export type Env = z.infer<typeof EnvSchema>;
