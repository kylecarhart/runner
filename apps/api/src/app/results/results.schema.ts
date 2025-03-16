import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { withBaseSchema } from "../../database/base.schema.js";
import { participants } from "../participants/participants.schema.js";

/**
 * A result is a participant's performance in a race.
 */
export const results = pgTable("results", (c) =>
  withBaseSchema({
    participantId: c
      .uuid()
      .notNull()
      .references(() => participants.id),
    clockTime: c.integer(), // milliseconds, null is DNF
    chipTime: c.integer(), // milliseconds, null is DNF
    place: c.integer(),
  }),
);

export const resultsRelations = relations(results, ({ one }) => ({
  participant: one(participants, {
    fields: [results.participantId],
    references: [participants.id],
  }),
}));
