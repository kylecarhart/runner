import { z } from "zod";
import {
  SuccessResponseSchema,
  withPaginationSchema,
  withSuccessSchema,
} from "./response.js";

/**
 * Password schema
 */
const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(64)
  .refine(
    (value) => {
      const strongPassword = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})",
      );
      return strongPassword.test(value);
    },
    {
      message:
        "Password must be at least 8 characters, contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    },
  );

/**
 * Select user schema
 */
export const SelectUserSchema = z.object({
  id: z.string().uuid(),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(64)
    .nullable()
    .openapi({ example: "Kyle" }),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(64)
    .nullable()
    .openapi({ example: "Carhart" }),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20)
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message:
        "Username can only contain letters, numbers, underscores, and hyphens",
    })
    .openapi({ example: "kcarhart" }),
  email: z
    .string()
    .email("Email is not valid")
    .openapi({ example: "kyle@example.com" }),
  password: PasswordSchema.openapi({ example: "!Password123" }),
  dob: z.string().nullable(),
  confirmedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/**
 * ! IMPORTANT: We never want to return the password.
 */
export const UserSchema = SelectUserSchema.omit({
  password: true,
})
  .strict()
  .openapi("User");

/**
 * Get a single user
 */
export const GetUserParamsSchema = SelectUserSchema.pick({ id: true });
export const GetUserResponseSchema =
  withSuccessSchema(UserSchema).openapi("GetUserResponse");

/**
 * Get many users
 */
export const GetUsersResponseSchema = withPaginationSchema(
  z.array(UserSchema),
).openapi("GetUsersResponse");

/**
 * Create a basic, unconfirmed user
 */
export const CreateUserRequestSchema = SelectUserSchema.pick({
  username: true,
  email: true,
  password: true,
});
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
export const CreateUserResponseSchema =
  withSuccessSchema(UserSchema).openapi("CreateUserResponse");

/**
 * Update a user
 */
export const UpdateUserParamsSchema = SelectUserSchema.pick({ id: true });
export const UpdateUserRequestSchema = SelectUserSchema.pick({
  firstName: true,
  lastName: true,
}).partial();
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;
export const UpdateUserResponseSchema =
  withSuccessSchema(UserSchema).openapi("UpdateUserResponse");

/**
 * Change a user's password
 */
export const ChangePasswordParamsSchema = SelectUserSchema.pick({ id: true });
export const ChangePasswordRequestSchema = z
  .object({
    oldPassword: z.string().openapi({ example: "!Password123" }),
    password: PasswordSchema.openapi({ example: "!Password1234" }),
    confirmPassword: z.string().openapi({ example: "!Password1234" }),
  })
  // TODO: Look into super refinement
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((schema) => schema.password !== schema.oldPassword, {
    message: "New password cannot be the same as old password.",
    path: ["password"],
  });
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;
export const ChangePasswordResponseSchema = SuccessResponseSchema;

/**
 * Delete a user
 */
export const DeleteUserParamsSchema = SelectUserSchema.pick({ id: true });
export const DeleteUserResponseSchema = SuccessResponseSchema;
