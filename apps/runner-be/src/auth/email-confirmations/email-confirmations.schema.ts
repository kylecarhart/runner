import { relations, type InferSelectModel } from "drizzle-orm";
import { index, pgTable } from "drizzle-orm/pg-core";
import { users } from "../../app/users/users.schema.js";
import { withBaseSchema } from "../../database/base.schema.js";
import { timestamp8601 } from "../../utils/drizzle.js";

export const emailConfirmations = pgTable(
  "emailConfirmations",
  (c) =>
    withBaseSchema({
      userId: c
        .uuid("userId")
        .references(() => users.id)
        .notNull(),
      code: c.text().notNull(),
      expiresAt: timestamp8601({ withTimezone: true }).notNull(),
    }),
  (table) => [index("emailConfirmations_userId_idx").on(table.userId)],
);

export const emailConfirmationsRelations = relations(
  emailConfirmations,
  ({ one }) => ({
    user: one(users, {
      fields: [emailConfirmations.userId],
      references: [users.id],
    }),
  }),
);

export type EmailConfirmation = InferSelectModel<typeof emailConfirmations>;
