import { relations } from "drizzle-orm";
import { index, pgTable } from "drizzle-orm/pg-core";
import { withBaseSchema } from "../../database/base.schema.js";
import { events } from "../events/events.schema.js";

/**
 * A single race in an event.
 *
 * TODO: A user should not be able to delete a race after any participants have registered.
 */
export const races = pgTable(
  "races",
  (c) =>
    withBaseSchema({
      name: c.text().notNull(),
      type: c.text().notNull(), // "5k", "10k", "half marathon", "marathon"
      date: c.timestamp({ withTimezone: true, mode: "string" }).notNull(),
      eventId: c
        .uuid()
        .references(() => events.id)
        .notNull(),
      status: c.text().notNull(), // "draft", "published"
    }),
  (table) => [index("races_eventId_idx").on(table.eventId)],
);

export const racesRelations = relations(races, ({ one }) => ({
  event: one(events, {
    fields: [races.eventId],
    references: [events.id],
  }),
  // userRaces: many(userRace),
}));
