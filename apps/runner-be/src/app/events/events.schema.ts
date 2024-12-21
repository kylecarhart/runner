import { relations } from "drizzle-orm";
import { index, pgTable } from "drizzle-orm/pg-core";
import { withBaseSchema } from "../../database/base.schema.js";
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
      // startDate: c.timestamp({ withTimezone: true, mode: "string" }).notNull(),
      // endDate: c.timestamp({ withTimezone: true, mode: "string" }),
      status: c.text({ enum: ["draft", "published"] }).notNull(),
    }),
  (table) => [index("events_createdBy_idx").on(table.createdBy)],
);

export const eventsRelations = relations(events, ({ many, one }) => ({
  races: many(races),
  createdBy: one(users, {
    fields: [events.createdBy],
    references: [users.id],
  }),
}));
