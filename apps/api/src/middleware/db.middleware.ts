import { createMiddleware } from "hono/factory";
import { initDb } from "../database/db.js";
import { HonoEnv } from "../index.js";

/**
 * Database middleware that initializes the database and sets it in the context.
 * @returns Hono database middleware
 */
export const dbMiddleware = () =>
  createMiddleware<HonoEnv>(async (c, next) => {
    c.set("db", initDb(c.env)); // Set the db in context
    await next();
  });
