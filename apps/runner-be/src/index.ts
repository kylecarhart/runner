import { bodyParser } from "@koa/bodyparser";
import cors from "@koa/cors";
import Router from "@koa/router";
import Koa from "koa";
import koaHelmet from "koa-helmet";
import { errorMiddleware } from "./middleware/error.middleware";
import { loggerMiddleware } from "./middleware/logger.middleware";
import { userRouter } from "./users/users.route";
import { Env } from "./utils/env";
import { logger } from "./utils/logger";

const app = new Koa();
const router = new Router({ prefix: "/api/v1" });

app.use(koaHelmet()); // Basic security
app.use(cors()); // CORS
app.use(bodyParser()); // Parse JSON request body

app.use(errorMiddleware());
app.use(loggerMiddleware());

/** Health check */
router.get("/health", (ctx, next) => {
  ctx.body = "OK";
});

/** Error check */
router.get("/error", (ctx, next) => {
  throw new Error("Test error");
});

/** V1 Routes */
router.use("/users", userRouter.routes());

app.use(router.routes()).use(router.allowedMethods());

app.listen(Env.PORT, () => {
  logger.info(`Server started on port ${Env.PORT}`);
});
