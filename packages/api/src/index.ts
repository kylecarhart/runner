import { z } from "zod";

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
  password: z
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
    ),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const GetUserResponseSchema = SelectUserSchema.omit({
  password: true,
});

export const CreateUserRequestSchema = SelectUserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

export const GetUsersRequestQueryParamsSchema = SelectUserSchema.partial().omit(
  {
    id: true,
    password: true,
    email: true,
  },
);
export const GetUsersResponseSchema = z.array(GetUserResponseSchema);
