import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdDate: timestamp("createdDate", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull(),
  updatedDate: timestamp("updatedDate", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull(),
});
