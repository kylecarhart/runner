import { config } from "@dotenvx/dotenvx";
import { z } from "zod";

config(); // Load environment variables

/**
 * Schema that validates environment variables for safe usage.
 * Log level is set to "info" by default.
 */
const EnvSchema = z.object({
  // Environment
  NODE_ENV: z.enum(["development", "production"]),
  LOG_LEVEL: z
    .enum(["error", "warn", "info", "http", "verbose", "debug", "silly"])
    .default("info"),
  // Server
  PORT: z.coerce.number(),
  // Database
  DB_HOST: z.string(),
  DB_PORT_TRANSACTION: z.coerce.number(),
  DB_PORT_SESSION: z.coerce.number(),
  DB_PORT: z.coerce.number(), // TODO: Not sure if I want to keep this
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

export const Env = EnvSchema.parse(process.env);
export type Env = z.infer<typeof EnvSchema>;

/** Helper to check if environment is development */
export const isDevelopment = Env.NODE_ENV === "development";
