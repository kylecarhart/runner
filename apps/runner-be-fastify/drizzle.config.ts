import { defineConfig } from "drizzle-kit";
import { env } from "src/utils/env";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schemas/!(base)*.schema.ts",
  out: "./drizzle",
  dbCredentials: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    ssl: "allow",
  },
  migrations: {
    schema: "public", // used in PostgreSQL only and default to `drizzle`
  },
});
