import type { InferSelectModel } from "drizzle-orm";
import { pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import { withBaseSchema } from "../../database/base.schema.js";
import { lower } from "../../utils/drizzle.js";

export const INDEX_UNIQUE_USERNAME = "users_username_unique";
export const INDEX_UNIQUE_EMAIL = "users_email_unique";

export const users = pgTable(
  "users",
  (c) =>
    withBaseSchema({
      firstName: c.text().notNull(),
      lastName: c.text().notNull(),
      username: c.text().notNull(),
      email: c.text().notNull(),
      password: c.text().notNull(),
      dob: c.timestamp({ withTimezone: true, mode: "string" }).notNull(),
    }),
  (table) => ({
    /** @see https://orm.drizzle.team/learn/guides/unique-case-insensitive-email */
    emailUniqueIndex: uniqueIndex(INDEX_UNIQUE_EMAIL).on(lower(table.email)),
    usernameUniqueIndex: uniqueIndex(INDEX_UNIQUE_USERNAME).on(
      lower(table.username),
    ),
  }),
);

export type UserWithPassword = InferSelectModel<typeof users>;
export type User = Omit<UserWithPassword, "password">;
