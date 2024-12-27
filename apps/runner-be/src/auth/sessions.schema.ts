import { type InferSelectModel } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { users } from "../app/users/users.schema.js";
import { timestamp8601 } from "../utils/drizzle.js";

export const sessions = pgTable("sessions", (c) => ({
  id: c.text().primaryKey(),
  userId: c
    .uuid()
    .notNull()
    .references(() => users.id)
    .unique(),
  expiresAt: timestamp8601({ withTimezone: true }).notNull(),
}));

export type Session = InferSelectModel<typeof sessions>;
