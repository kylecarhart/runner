import { type InferSelectModel } from "drizzle-orm";
import { pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "../app/users/users.schema.js";
import { timestamp8601 } from "../utils/drizzle.js";

const INDEX_UNIQUE_USER_ID = "sessions_user_id_unique";

export const sessions = pgTable(
  "sessions",
  (c) => ({
    id: c.text().primaryKey(),
    userId: c
      .uuid()
      .notNull()
      .references(() => users.id),
    expiresAt: timestamp8601({ withTimezone: true }).notNull(),
  }),
  (table) => [uniqueIndex(INDEX_UNIQUE_USER_ID).on(table.userId)],
);

export type Session = InferSelectModel<typeof sessions>;
