import { pgTable, text } from "drizzle-orm/pg-core";
import { withBaseSchema } from "./base.schema.js";

export const usersSchema = pgTable(
  "users",
  withBaseSchema({
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
  }),
);

// Schema for inserting a user - can be used to validate API requests
// const insertUserSchema = createInsertSchema(userSchema);

// Schema for selecting a user - can be used to validate API responses
// const selectUserSchema = createSelectSchema(userSchema);

// Overriding the fields
// const insertUserSchema = createInsertSchema(users, {
//   role: z.string(),
// });

// Refining the fields - useful if you want to change the fields before they become nullable/optional in the final schema
// const insertUserSchema = createInsertSchema(users, {
//   id: (schema) => schema.id.positive(),
//   email: (schema) => schema.email.email(),
//   role: z.string(),
// });

// Usage

// const user = insertUserSchema.parse({
//   name: "John Doe",
//   email: "johndoe@test.com",
//   role: "admin",
// });

// Zod schema type is also inferred from the table schema, so you have full type safety
// const requestSchema = insertUserSchema.pick({ name: true, email: true });
