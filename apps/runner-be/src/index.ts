import { bodyParser } from "@koa/bodyparser";
import cors from "@koa/cors";
import Router from "@koa/router";
import { document } from "@runner/api";
import Koa from "koa";
import koaHelmet from "koa-helmet";
import { errorMiddleware } from "./middleware/error.middleware";
import { loggerMiddleware } from "./middleware/logger.middleware";
import { userRouter } from "./users/users.route";
import { Env } from "./utils/env";
import { logger } from "./utils/logger";

const app = new Koa();
const baseRouter = new Router();
const v1Router = new Router({ prefix: "/api/v1" });

app.use(koaHelmet()); // Basic security
app.use(cors()); // CORS
app.use(bodyParser()); // Parse JSON request body

app.use(errorMiddleware());
app.use(loggerMiddleware());

/** OpenAPI */
baseRouter.get(Env.PATH_OPENAPI, (ctx, next) => {
  ctx.body = document;
});

/** Health check */
baseRouter.get("/health", (ctx, next) => {
  ctx.body = "OK";
});

/** Error check */
v1Router.get("/error", (ctx, next) => {
  throw new Error("Test error");
});

/** API V1 Routes */
v1Router.use("/users", userRouter.routes());

app.use(baseRouter.routes()).use(baseRouter.allowedMethods());
app.use(v1Router.routes()).use(v1Router.allowedMethods());

app.listen(Env.PORT, () => {
  logger.info(`Server started on port ${Env.PORT}`);
});
