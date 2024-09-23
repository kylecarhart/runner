import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as events from "../events/events.schema";
import * as participants from "../participants/participants.schema";
import * as races from "../races/races.schema";
import * as results from "../results/results.schema";
import * as users from "../users/users.schema";
import { Env } from "../utils/env";

// Connect to your database using the Connection Pooler for serverless environments, and the Direct Connection for long-running servers.
const client = postgres({
  host: Env.DB_HOST,
  port: Env.DB_PORT,
  database: Env.DB_NAME,
  username: Env.DB_USER,
  password: Env.DB_PASSWORD,
  // prepare: false,
});

// NOTE: The schemas are imported and spread to include the relations as well.
const schema = {
  ...users,
  ...events,
  ...races,
  ...participants,
  ...results,
};

export const db = drizzle(client, { schema });
