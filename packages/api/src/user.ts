import { z } from "zod";

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
  firstName: z.string().min(1, "First name is required").max(64),
  lastName: z.string().min(1, "Last name is required").max(64),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20)
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message:
        "Username can only contain letters, numbers, underscores, and hyphens",
    }),
  email: z.string().email("Email is not valid"),
  password: PasswordSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

/**
 * Get a single user
 */
export const GetUserParamsSchema = SelectUserSchema.pick({ id: true });
export const GetUserResponseSchema = SelectUserSchema.omit({
  password: true,
})
  .strict()
  .openapi("User");

/**
 * Get many users
 */
export const GetUsersRequestQueryParamsSchema = SelectUserSchema.partial().omit(
  {
    id: true,
    password: true,
    email: true,
  },
);
export const GetUsersResponseSchema = z.array(GetUserResponseSchema);

/**
 * Create a new user
 */
export const CreateUserRequestSchema = SelectUserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
  .extend({
    confirmPassword: z.string(),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
export const CreateUserResponseSchema = GetUserResponseSchema;

/**
 * Update a user
 */
export const UpdateUserParamsSchema = SelectUserSchema.pick({ id: true });
export const UpdateUserRequestSchema = SelectUserSchema.omit({
  id: true,
  username: true, // TODO: Do we ever want a person to be able to change their username?
  email: true, // TODO: Changing email will require a confirmation.
  password: true,
  createdAt: true,
  updatedAt: true,
});
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;
export const UpdateUserResponseSchema = GetUserResponseSchema;

/**
 * Change a user's password
 */
export const ChangePasswordParamsSchema = SelectUserSchema.pick({ id: true });
export const ChangePasswordRequestSchema = SelectUserSchema.pick({
  password: true,
})
  .extend({
    oldPassword: z.string(),
    confirmPassword: z.string(),
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
export const ChangePasswordResponseSchema = GetUserResponseSchema;

/**
 * Delete a user
 */
export const DeleteUserParamsSchema = SelectUserSchema.pick({ id: true });
export const DeleteUserResponseSchema = GetUserResponseSchema;
