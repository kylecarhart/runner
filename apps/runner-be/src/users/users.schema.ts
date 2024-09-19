import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
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

export const createUserRequestSchema = createInsertSchema(users, {
  firstName: (schema) => schema.firstName.max(255),
  lastName: (schema) => schema.lastName.max(255),
  username: (schema) => schema.username.min(4).max(25),
  email: (schema) => schema.email.email(),
  password: (schema) => schema.password.min(8).max(128),
});
export type CreateUser = z.infer<typeof createUserRequestSchema>;

// const updateUserSchema = createUserRequestSchema.partial();
// type UpdateUser = z.infer<typeof updateUserSchema>;

// Schema for selecting a user - can be used to validate API responses
export const selectUserSchema = createSelectSchema(users);
export type User = z.infer<typeof selectUserSchema>;
