import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { withBaseSchema } from "../../database/base.schema.js";
import { races } from "../races/races.schema.js";

export const events = pgTable("events", (c) =>
  withBaseSchema({
    name: c.text().notNull(),
    startDate: c
      .timestamp({
        withTimezone: true,
        mode: "string",
      })
      .notNull(),
    endDate: c.timestamp({
      withTimezone: true,
      mode: "string",
    }),
  }),
);

export const eventsRelations = relations(events, ({ many }) => ({
  races: many(races),
}));
