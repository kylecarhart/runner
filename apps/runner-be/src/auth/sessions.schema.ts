import { type InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "../app/users/users.schema.js";

export const INDEX_UNIQUE_USERNAME = "users_username_unique";
export const INDEX_UNIQUE_EMAIL = "users_email_unique";

export const sessions = pgTable("sessions", (c) => ({
  id: text("id").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expiresAt", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
}));

export type Session = InferSelectModel<typeof sessions>;
