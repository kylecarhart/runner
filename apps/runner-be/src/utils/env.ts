import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  // Environment
  NODE_ENV: z.enum(["development", "production"]),
  // Server
  PORT: z.string().default("3000"),
  // Database
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  // OpenAPI
  PATH_SWAGGER: z.string(),
  PATH_SWAGGER_JSON: z.string(),
  // Auth
  JWT_SECRET: z.string(),
});

export const Env = EnvSchema.parse(process.env);
export type Env = z.infer<typeof EnvSchema>;
