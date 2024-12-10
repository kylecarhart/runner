import { getTableColumns, relations, type InferSelectModel } from "drizzle-orm";
import { pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import { emailConfirmations } from "../../auth/email-confirmations/email-confirmations.schema.js";
import { withBaseSchema } from "../../database/base.schema.js";
import { ConstraintError } from "../../errors/ConstraintError.js";
import { lower } from "../../utils/drizzle.js";

export const INDEX_UNIQUE_USERNAME = "users_username_unique";
export const INDEX_UNIQUE_EMAIL = "users_email_unique";

export const users = pgTable(
  "users",
  (c) =>
    withBaseSchema({
      firstName: c.text(),
      lastName: c.text(),
      username: c.text().notNull(),
      email: c.text().notNull(),
      password: c.text().notNull(),
      dob: c.timestamp({ withTimezone: true, mode: "string" }),
      confirmedAt: c.timestamp({ withTimezone: true, mode: "string" }),
    }),
  (table) => [
    /** @see https://orm.drizzle.team/learn/guides/unique-case-insensitive-email */
    uniqueIndex(INDEX_UNIQUE_EMAIL).on(lower(table.email)),
    uniqueIndex(INDEX_UNIQUE_USERNAME).on(lower(table.username)),
  ],
);

export const usersRelations = relations(users, ({ one }) => ({
  emailConfirmation: one(emailConfirmations, {
    fields: [users.id],
    references: [emailConfirmations.userId],
  }),
}));

/**
 * A helper that excludes the password field from user queries. Used with
 * Drizzle's `returning()` to ensure passwords are never sent to clients.
 *
 * @example
 * await db
 *   .insert(users)
 *   .values({ ...createUserRequest, password: hashedPassword })
 *   .returning(withoutPassword);
 */
export const withoutPassword = Object.fromEntries(
  Object.entries(getTableColumns(users)).filter(([key]) => key !== "password"),
) as Omit<(typeof users)["_"]["columns"], "password">;

export const UsersErrorMap = {
  [INDEX_UNIQUE_USERNAME]: new ConstraintError(
    "Username already in use.",
    INDEX_UNIQUE_USERNAME,
  ),
  [INDEX_UNIQUE_EMAIL]: new ConstraintError(
    "Email already in use.",
    INDEX_UNIQUE_EMAIL,
  ),
};

export type UserWithPassword = InferSelectModel<typeof users>;
export type User = Omit<UserWithPassword, "password">;
