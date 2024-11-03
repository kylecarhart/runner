import { relations } from "drizzle-orm";
import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { withBaseSchema } from "../../database/base.schema.js";
import { races } from "../races/races.schema.js";
import { users } from "../users/users.schema.js";

export const participants = pgTable(
  "participants",
  withBaseSchema({
    userId: uuid("userId")
      .notNull()
      .references(() => users.id),
    raceId: uuid("raceId")
      .notNull()
      .references(() => races.id),

    bib: text("bib"),

    // Even though these can change over time, we want to know what they were
    // when they participated
    age: integer("age"),
    city: text("city"),
    state: text("state"),
    county: text("county"),
    gender: text("gender"),
  }),
);

export const participantsRelations = relations(participants, ({ one }) => ({
  race: one(races, {
    fields: [participants.raceId],
    references: [races.id],
  }),
  user: one(users, {
    fields: [participants.userId],
    references: [users.id],
  }),
}));
