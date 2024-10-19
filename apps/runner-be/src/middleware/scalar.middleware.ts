import { Context, Next } from "koa";
import compose from "koa-compose";
import koaHelmet from "koa-helmet";
import { Env } from "../utils/env.ts";

/**
 * Route handler for scalar docs UI
 * @returns Scalar UI openapi docs middleware
 */
export const scalarMiddleware = () =>
  compose([koaHelmet.contentSecurityPolicy(scalarCsp), scalarRouteHandler]);

/**
 * Route handler for scalar openapi docs
 * @returns Scalar docs
 */
const scalarRouteHandler = async (ctx: Context, next: Next) => {
  ctx.type = "html";
  ctx.body = scalarHtml;
};

/**
 * Content security policy for scalar docs UI
 */
const scalarCsp = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      "https://cdnjs.cloudflare.com",
      "https://cdn.jsdelivr.net",
    ],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https:"],
    fontSrc: ["'self'", "https:"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
};

/**
 * Scalar UI Html template to serve
 */
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
    <script
      id="api-reference"
      data-url="${Env.PATH_OPENAPI}"></script>
    <script>
      var configuration = {
        theme: 'purple',
      };

      document.getElementById('api-reference').dataset.configuration = JSON.stringify(configuration);
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`;
