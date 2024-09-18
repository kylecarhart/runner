import { relations } from "drizzle-orm";
import { pgTable, uuid } from "drizzle-orm/pg-core";
import { withBaseSchema } from "../database/base.schema";
import { races } from "../races/races.schema";
import { users } from "../users/users.schema";

export const participants = pgTable(
  "participants",
  withBaseSchema({
    userId: uuid("userId")
      .notNull()
      .references(() => users.id),
    raceId: uuid("raceId")
      .notNull()
      .references(() => races.id),
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
