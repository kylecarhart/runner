import cors from "@koa/cors";
import Router from "@koa/router";
import Koa from "koa";
import { userRouter } from "./users/users.route";
import { Env } from "./utils/env";
import { logger } from "./utils/logger";

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
  logger.info(`Server started on port ${Env.PORT}`);
});
