import { relations, type InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "../../app/users/users.schema.js";
import { withBaseSchema } from "../../database/base.schema.js";

export const emailConfirmations = pgTable("emailConfirmations", (c) =>
  withBaseSchema({
    userId: uuid("userId")
      .references(() => users.id)
      .notNull(),
    code: text().notNull(),
    expiresAt: timestamp({
      withTimezone: true,
      mode: "date",
    }).notNull(),
  }),
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
