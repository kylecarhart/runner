import Router from "@koa/router";
import { CreateUserRequestSchema, SelectUserSchema } from "@runner/api";
import { db } from "../database/db";
import { validate } from "../middleware/validate.middleware";
import { usersService } from "./users.service";

export const userRouter = new Router();

userRouter.get("/", async (ctx, next) => {
  const allUsers = await db.query.events.findMany({
    with: {
      races: true,
    },
  });
  ctx.body = JSON.stringify(allUsers, null, 2);
});

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
