import { InferSelectModel } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { withBaseSchema } from "../database/base.schema";

export const users = pgTable(
  "users",
  withBaseSchema({
    firstName: text("firstName").notNull(),
    lastName: text("lastName").notNull(),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
  }),
);

export type User = InferSelectModel<typeof users>;
