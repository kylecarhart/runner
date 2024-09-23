import Router from "@koa/router";
import {
  ChangePasswordParamsSchema,
  ChangePasswordRequestSchema,
  CreateUserRequestSchema,
  GetUserParamsSchema,
  GetUserResponseSchema,
  GetUsersRequestQueryParamsSchema,
  GetUsersResponseSchema,
  SuccessResponseSchema,
  UpdateUserParamsSchema,
  UpdateUserRequestSchema,
  withSuccessResponseSchema,
} from "@runner/api";
import { validate } from "../middleware/validate.middleware";
import { usersService } from "./users.service";

export const userRouter = new Router();

/**
 * Create a new user
 */
userRouter.post(
  "create-user",
  "/",
  validate(
    {
      req: CreateUserRequestSchema,
      res: withSuccessResponseSchema(GetUserResponseSchema),
    },
    async (ctx) => {
      const createUserRequest = ctx.requestBody;
      const newUser = await usersService.createUser(createUserRequest);
      ctx.body = { success: true, message: "User created", data: newUser };
    },
  ),
);

/**
 * Query users
 */
userRouter.get(
  "query-users",
  "/",
  validate(
    {
      res: withSuccessResponseSchema(GetUsersResponseSchema),
      query: GetUsersRequestQueryParamsSchema,
    },
    async (ctx) => {
      const params = ctx.query;
      const users = await usersService.queryUsers(params);
      ctx.body = { success: true, data: users };
    },
  ),
);

/**
 * Get a user by id
 */
userRouter.get(
  "get-user",
  "/:id",
  validate(
    {
      params: GetUserParamsSchema,
      res: withSuccessResponseSchema(GetUserResponseSchema),
    },
    async (ctx) => {
      const { id } = ctx.params;
      const user = await usersService.getUserById(id);
      ctx.body = { success: true, data: user };
    },
  ),
);

/**
 * Update a users basic information
 * TODO: PUT or PATCH? Does it really matter at all? Semantics :|
 */
userRouter.patch(
  "update-user",
  "/:id",
  validate(
    {
      params: UpdateUserParamsSchema,
      req: UpdateUserRequestSchema,
      res: withSuccessResponseSchema(GetUserResponseSchema),
    },
    async (ctx) => {
      const { id } = ctx.params;
      const updateUserRequest = ctx.requestBody;

      const updatedUser = await usersService.updateUser(id, updateUserRequest);
      ctx.body = { success: true, message: "User updated", data: updatedUser };
    },
  ),
);

/**
 * Delete a user.
 */
userRouter.delete(
  "delete-user",
  "/:id",
  validate(
    {
      params: UpdateUserParamsSchema,
      res: SuccessResponseSchema,
    },
    async (ctx) => {
      const { id } = ctx.params;
      await usersService.deleteUser(id);
      ctx.body = { success: true, message: `User ${id} deleted.` };
    },
  ),
);

/**
 * Change user password
 */
userRouter.patch(
  "change-password",
  "/:id/password",
  validate(
    {
      params: ChangePasswordParamsSchema,
      req: ChangePasswordRequestSchema,
      res: SuccessResponseSchema,
    },
    async (ctx) => {
      const { id } = ctx.params;
      const changePasswordRequest = ctx.requestBody;

      await usersService.changePassword(id, changePasswordRequest);

      ctx.body = { success: true, message: `User ${id} password changed.` };
    },
  ),
);
