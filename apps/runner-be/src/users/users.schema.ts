import { InferSelectModel } from "drizzle-orm";
import { pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { withBaseSchema } from "../database/base.schema";
import { lower } from "../utils/drizzle";

export const users = pgTable(
  "users",
  withBaseSchema({
    firstName: text("firstName").notNull(),
    lastName: text("lastName").notNull(),
    username: text("username").notNull().unique(),
    email: text("email").notNull(),
    password: text("password").notNull(),
  }),
  (table) => ({
    /** @see https://orm.drizzle.team/learn/guides/unique-case-insensitive-email */
    emailUniqueIndex: uniqueIndex("emailUniqueIndex").on(lower(table.email)),
  }),
);

export type UserWithPassword = InferSelectModel<typeof users>;
export type User = Omit<UserWithPassword, "password">;
