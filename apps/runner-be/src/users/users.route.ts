import Router from "@koa/router";
import { db } from "../database/db.js";
import { users } from "./users.schema.js";

export const userRouter = new Router();

userRouter.get("/", async (ctx, next) => {
  const allUsers = await db.select().from(users);
  ctx.body = JSON.stringify(allUsers);
});
