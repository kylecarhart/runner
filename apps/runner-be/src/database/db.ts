import { drizzle } from "drizzle-orm/postgres-js";
import { getContext } from "hono/context-storage";
import postgres from "postgres";
import * as events from "../app/events/events.schema.js";
import * as participants from "../app/participants/participants.schema.js";
import * as races from "../app/races/races.schema.js";
import * as results from "../app/results/results.schema.js";
import * as users from "../app/users/users.schema.js";
import * as emailConfirmations from "../auth/email-confirmations/email-confirmations.schema.js";
import { HonoEnv } from "../index.js";
import { Env } from "../utils/env.js";

// Connect to your database using the Connection Pooler for serverless
// environments (Transaction), and the Direct Connection for long-running
// servers (Session).
const client = (env: Env) =>
  postgres({
    host: env.DB_HOST,
    port: env.DB_PORT_TRANSACTION,
    database: env.DB_NAME,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    prepare: false,
  });

export const initDb = (env: Env) =>
  drizzle(client(env), {
    schema: {
      ...users,
      ...events,
      ...races,
      ...participants,
      ...results,
      ...emailConfirmations,
    },
  });

/** Database from context */
export const db = () => getContext<HonoEnv>().var.db;
export type Database = ReturnType<typeof initDb>;
