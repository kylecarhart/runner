import Router from "@koa/router";

export const userRouter = new Router();

userRouter.get("/", (ctx, next) => {
  ctx.body = "Get users";
});
