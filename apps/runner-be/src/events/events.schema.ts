import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { withBaseSchema } from "../database/base.schema.js";
import { races } from "../races/races.schema.js";

export const events = pgTable(
  "events",
  withBaseSchema({
    name: text("name").notNull(),
    startDate: timestamp("startDate", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    endDate: timestamp("endDate", { withTimezone: true, mode: "string" }),
  }),
);

export const eventsRelations = relations(events, ({ many }) => ({
  races: many(races),
}));
