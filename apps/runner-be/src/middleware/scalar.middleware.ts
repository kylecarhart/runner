import { Context, Next } from "koa";
import koaHelmet from "koa-helmet";
import { Env } from "../utils/env";

/**
 * Route handler for scalar openapi docs
 * @returns Scalar docs
 */
export const scalarMiddleware = () => async (ctx: Context, next: Next) => {
  ctx.type = "html";
  ctx.body = scalarHtml;
};

// const scalarHandler = async (ctx: Context, next: Next) => {};

export const scalarHelmet = koaHelmet.contentSecurityPolicy({
  directives: {
    defaultSrc: [`'self'`, "unpkg.com"],
    styleSrc: [
      `'self'`,
      `'unsafe-inline'`,
      "cdn.jsdelivr.net",
      "fonts.googleapis.com",
      "unpkg.com",
    ],
    fontSrc: [`'self'`, "fonts.gstatic.com", "data:"],
    imgSrc: [`'self'`, "data:", "cdn.jsdelivr.net"],
    scriptSrc: [
      `'self'`,
      `https: 'unsafe-inline'`,
      `cdn.jsdelivr.net`,
      `'unsafe-eval'`,
    ],
  },
});

const scalarHtml = `<!doctype html>
<html>
  <head>
    <title>Scalar API Reference</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <!-- Need a Custom Header? Check out this example https://codepen.io/scalarorg/pen/VwOXqam -->
    <script
      id="api-reference"
      data-url="${Env.PATH_OPENAPI}"></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`;
