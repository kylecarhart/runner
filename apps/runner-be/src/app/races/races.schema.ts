import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { withBaseSchema } from "../../database/base.schema.js";
import { events } from "../events/events.schema.js";

export const races = pgTable("races", (c) =>
  withBaseSchema({
    name: c.text().notNull(),
    type: c.text().notNull(),
    date: c.timestamp({ mode: "string" }).notNull(),
    eventId: c
      .uuid()
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
