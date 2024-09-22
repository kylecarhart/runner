import Router from "@koa/router";
import {
  CreateUserRequestSchema,
  GetUserParamsSchema,
  GetUserResponseSchema,
  GetUsersRequestQueryParamsSchema,
  GetUsersResponseSchema,
  UpdateUserParamsSchema,
  UpdateUserRequestSchema,
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
    { req: CreateUserRequestSchema, res: GetUserResponseSchema },
    async (ctx) => {
      const createUserRequest = ctx.requestBody;
      const newUser = await usersService.createUser(createUserRequest);
      ctx.body = newUser;
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
      res: GetUsersResponseSchema,
      query: GetUsersRequestQueryParamsSchema,
    },
    async (ctx) => {
      const params = ctx.query;
      const users = await usersService.queryUsers(params);
      ctx.body = users;
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
    { params: GetUserParamsSchema, res: GetUserResponseSchema },
    async (ctx) => {
      const { id } = ctx.params;
      ctx.body = await usersService.getUserById(id);
    },
  ),
);

/**
 * Update a users basic information
 */
userRouter.patch(
  "update-user",
  "/:id",
  validate(
    {
      params: UpdateUserParamsSchema,
      req: UpdateUserRequestSchema,
      res: GetUserResponseSchema,
    },
    async (ctx) => {
      const { id } = ctx.params;
      const updateUserRequest = ctx.requestBody;

      const updatedUser = await usersService.updateUser(id, updateUserRequest);
      ctx.body = updatedUser;
    },
  ),
);
