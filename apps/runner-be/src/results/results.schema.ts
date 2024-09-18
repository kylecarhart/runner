import { relations } from "drizzle-orm";
import { integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { withBaseSchema } from "../database/base.schema";
import { participants } from "../participants/participants.schema";

export const results = pgTable(
  "results",
  withBaseSchema({
    participantId: uuid("participantId")
      .notNull()
      .references(() => participants.id),
    time: integer("time"), // milliseconds, null is DNF
  }),
);

export const resultsRelations = relations(results, ({ one }) => ({
  participant: one(participants, {
    fields: [results.participantId],
    references: [participants.id],
  }),
}));
