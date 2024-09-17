import cors from "@koa/cors";
import Router from "@koa/router";
import Koa from "koa";

const app = new Koa();
const router = new Router();

app.use(cors());

router.get("/", (ctx, next) => {
  // ctx.router available
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
