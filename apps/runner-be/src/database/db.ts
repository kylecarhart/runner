import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { Env } from "../utils/env.js";

// Connect to your database using the Connection Pooler for serverless environments, and the Direct Connection for long-running servers.
const client = postgres({
  host: Env.DB_HOST,
  port: Env.DB_PORT,
  database: Env.DB_NAME,
  username: Env.DB_USER,
  password: Env.DB_PASSWORD,
  // prepare: false,
});

export const db = drizzle(client);
