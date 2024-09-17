import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { event } from "../events/entities/event.entity";

// import * as schema from "./schema";
export const client = new Client({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  user: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
});

const schema = {
  event,
};

export const db = drizzle(client, { schema });
