import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { withBaseSchema } from "../../../database/base.schema.js";
import { timestamp8601 } from "../../../utils/drizzle.js";
import { races } from "../races.schema.js";

/**
 * Pricing for a race, allowing for different pricing tiers over time. For
 * example, $30 for registering early, $40 normal, $50 late.
 */
export const racePricing = pgTable(
  "race_pricing",
  (c) =>
    withBaseSchema({
      raceId: c
        .uuid()
        .notNull()
        .references(() => races.id),
      price: c.numeric({ precision: 5, scale: 2 }).notNull(), // Max 999.99
      currency: c.text().notNull(),
      startsAt: timestamp8601({ withTimezone: true }).notNull(),
      endsAt: timestamp8601({ withTimezone: true }).notNull(),
    }),
  (table) => [],
);

export const racePricingRelations = relations(racePricing, ({ one }) => ({
  race: one(races, {
    fields: [racePricing.raceId],
    references: [races.id],
  }),
}));
