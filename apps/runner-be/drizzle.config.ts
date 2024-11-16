import { config } from "@dotenvx/dotenvx"; // TODO: Why the fuck cant I import my special Env typescript file.
import { defineConfig } from "drizzle-kit";

// TODO: For some reason, dotenvx variable expansion is not working...
config(); // Load environment variables

/**
 * This config file is specific to drizzle-kit and does not affect how your
 * database is connected to at runtime.
 *
 * NOTE: IMPORTANT: We need to use the compiled schema files in the dist folder
 * because drizzle-kit does not support ESM at the moment.
 *
 * @see https://github.com/drizzle-team/drizzle-orm/issues/819
 */
export default defineConfig({
  schema: "./dist/src/**/*.schema.js", // See above note
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    port: +process.env.DB_PORT_SESSION!,
  },
});
