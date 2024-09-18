import cors from "@koa/cors";
import Router from "@koa/router";
import Koa from "koa";
import { userRouter } from "./user/routes/user.route.js";
import { Env } from "./utils/env.js";

const app = new Koa();
const router = new Router({ prefix: "/api/v1" });

/** Use CORS */
app.use(cors());

/** Health check */
router.get("/health", (ctx, next) => {
  ctx.body = "OK";
});

/** V1 Routes */
router.use("/users", userRouter.routes());

app.use(router.routes()).use(router.allowedMethods());

app.listen(Env.PORT, () => {
  console.log(`Server started on port ${Env.PORT}`);
});
