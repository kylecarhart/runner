import compose from "koa-compose";
import koaHelmet from "koa-helmet";
import { koaSwagger, KoaSwaggerUiOptions } from "koa2-swagger-ui";
import { Env } from "../utils/env";

/**
 * Route handler for swagger docs UI
 * @returns Swagger UI openapi docs middleware
 */
export const swaggerMiddleware = (config?: Partial<KoaSwaggerUiOptions>) =>
  compose([
    koaHelmet.contentSecurityPolicy(swaggerCsp),
    koaSwagger({
      ...config,
      routePrefix: false,
      swaggerOptions: {
        ...config?.swaggerOptions,
        url: Env.PATH_OPENAPI, // example path to json
      },
    }),
  ]);

/**
 * Content security policy for swagger docs
 */
const swaggerCsp = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      "https://cdnjs.cloudflare.com",
      "https://fonts.googleapis.com",
    ],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https:"],
  },
};
