import Router from "@koa/router";
import {
  CreateUserRequestSchema,
  GetUsersRequestQueryParamsSchema,
  GetUsersResponseSchema,
  SelectUserSchema,
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
    { req: CreateUserRequestSchema, res: SelectUserSchema.array() },
    async (ctx) => {
      const createUserRequest = ctx.request.body;
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
  validate({ res: GetUsersResponseSchema }, async (ctx) => {
    const params = GetUsersRequestQueryParamsSchema.parse(ctx.request.query);
    const users = await usersService.queryUsers(params);
    ctx.body = users;
  }),
);

/**
 * Get a user by id
 */
userRouter.get(
  "get-user",
  "/:id",
  validate({ res: SelectUserSchema }, async (ctx) => {
    const { id } = ctx.params;
    ctx.body = await usersService.getById(id);
  }),
);
