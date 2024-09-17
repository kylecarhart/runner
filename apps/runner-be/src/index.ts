import cors from "@koa/cors";
import Router from "@koa/router";
import Koa from "koa";
import { Env } from "./utils/env.js";

const app = new Koa();
const router = new Router();

app.use(cors());

router.get("/", (ctx, next) => {
  // ctx.router available
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(Env.PORT, () => {
  console.log(`Server started on port ${Env.PORT}`);
});
