import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { withBaseSchema } from "../../database/base.schema.js";
import { timestamp8601 } from "../../utils/drizzle.js";
import { events } from "../events/events.schema.js";
import { racePricing } from "./pricing/race-pricing.schema.js";

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
      date: timestamp8601({ withTimezone: true }).notNull(),
      eventId: c
        .uuid()
        .references(() => events.id)
        .notNull(),
      status: c.text().notNull(), // "draft", "published"
    }),
  (table) => [],
);

export const racesRelations = relations(races, ({ one, many }) => ({
  event: one(events, {
    fields: [races.eventId],
    references: [events.id],
  }),
  racePricing: many(racePricing),
}));
