import Router from "@koa/router";
import { db } from "../database/db";

export const userRouter = new Router();

userRouter.get("/", async (ctx, next) => {
  const allUsers = await db.query.events.findMany({
    with: {
      races: true,
    },
  });
  ctx.body = JSON.stringify(allUsers, null, 2);
});
