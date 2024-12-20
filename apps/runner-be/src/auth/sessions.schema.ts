import { type InferSelectModel } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { users } from "../app/users/users.schema.js";

export const sessions = pgTable("sessions", (c) => ({
  id: c.text().primaryKey(),
  userId: c
    .uuid()
    .notNull()
    .references(() => users.id),
  expiresAt: c
    .timestamp({
      withTimezone: true,
      mode: "date",
    })
    .notNull(),
}));

export type Session = InferSelectModel<typeof sessions>;
