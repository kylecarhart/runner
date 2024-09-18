import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { withBaseSchema } from "../database/base.schema";
import { events } from "../events/events.schema";

export const races = pgTable(
  "races",
  withBaseSchema({
    name: text("name").notNull(),
    type: text("type").notNull(),
    date: timestamp("date", { mode: "string" }).notNull(),
    eventId: uuid("eventId")
      .references(() => events.id)
      .notNull(),
  }),
);

export const racesRelations = relations(races, ({ one }) => ({
  event: one(events, {
    fields: [races.eventId],
    references: [events.id],
  }),
  // userRaces: many(userRace),
}));
