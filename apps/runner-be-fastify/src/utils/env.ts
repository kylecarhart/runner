import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  // Server
  PORT: z.string(),
  // Database
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_NAME: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  // Swagger
  PATH_SWAGGER: z.string(),
  PATH_SWAGGER_JSON: z.string(),
  // JWT
  JWT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
