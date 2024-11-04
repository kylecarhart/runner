import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { withBaseSchema } from "../../database/base.schema.js";
import { races } from "../races/races.schema.js";
import { users } from "../users/users.schema.js";

export const participants = pgTable("participants", (c) =>
  withBaseSchema({
    userId: c
      .uuid()
      .notNull()
      .references(() => users.id),
    raceId: c
      .uuid()
      .notNull()
      .references(() => races.id),

    bib: c.text(),

    // Even though these can change over time, we want to know what they were
    // when they participated
    age: c.integer(),
    city: c.text(),
    state: c.text(),
    county: c.text(),
    gender: c.text(),
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
