import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { withBaseSchema } from "../../database/base.schema.js";
import { timestamp8601 } from "../../utils/drizzle.js";
import { races } from "../races/races.schema.js";
import { users } from "../users/users.schema.js";

/**
 * An event is a collection of races.
 */
export const events = pgTable(
  "events",
  (c) =>
    withBaseSchema({
      name: c.text().notNull(),
      description: c.text().notNull(),
      createdBy: c
        .uuid()
        .notNull()
        .references(() => users.id),
      startDate: timestamp8601({ withTimezone: true }).notNull(),
      // endDate: timestamp8601({ withTimezone: true }),
      status: c.text({ enum: ["draft", "published"] }).notNull(),
      address: c.text().notNull(),
      city: c.text().notNull(),
      state: c.text().notNull(),
      zip: c.text().notNull(),
    }),
  (table) => [],
);

export const eventsRelations = relations(events, ({ many, one }) => ({
  races: many(races),
  createdBy: one(users, {
    fields: [events.createdBy],
    references: [users.id],
  }),
}));
