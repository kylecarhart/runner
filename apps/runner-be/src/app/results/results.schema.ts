import { relations } from "drizzle-orm";
import { integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { withBaseSchema } from "../../database/base.schema.js";
import { participants } from "../participants/participants.schema.js";

export const results = pgTable(
  "results",
  withBaseSchema({
    participantId: uuid("participantId")
      .notNull()
      .references(() => participants.id),
    clockTime: integer("clockTime"), // milliseconds, null is DNF
    chipTime: integer("chipTime"), // milliseconds, null is DNF
    place: integer("place"),
  }),
);

export const resultsRelations = relations(results, ({ one }) => ({
  participant: one(participants, {
    fields: [results.participantId],
    references: [participants.id],
  }),
}));
