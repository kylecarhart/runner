import Router from "@koa/router";
import { db } from "../database/db";
import { validate } from "../middleware/validate.middleware";
import { createUserRequestSchema, selectUserSchema } from "./users.schema";
import { createUser } from "./users.service";

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
    { req: createUserRequestSchema, res: selectUserSchema.array() },
    async (ctx) => {
      const createUserRequest = ctx.request.body;
      const newUser = await createUser(createUserRequest);
      ctx.body = newUser;
    },
  ),
);
