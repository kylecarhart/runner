import { config } from "@dotenvx/dotenvx"; // TODO: Why the fuck cant I import my special Env typescript file.
import { defineConfig } from "drizzle-kit";

config(); // Load environment variables

export default defineConfig({
  // schema: ["./src/users/users.schema.ts", "./src/events/events.schema.ts"],
  schema: "./src/**/*.schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    port: +process.env.DB_PORT!,
  },
});
