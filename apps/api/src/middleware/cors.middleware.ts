import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";
import { HonoEnv } from "../index.js";
import { env, isDevelopment } from "../utils/env.js";

// Only allow localhost if we're in development the origin is localhost
const allowLocalhost = (origin: string) =>
  isDevelopment() && origin.startsWith("http://localhost:")
    ? origin
    : undefined;

/**
 * Cross Origin Resource Sharing (CORS) middleware.
 * @returns Hono CORS middleware
 */
export const corsMiddleware = () =>
  createMiddleware<HonoEnv>((c, next) => {
    const allowedOrigins = { [env().ALLOWED_ORIGIN]: true };

    const corsMiddleware = cors({
      // Does not send "Access-Control-Allow-Origin" if theres no match.
      origin: (origin) => {
        if (allowedOrigins[origin] || allowLocalhost(origin)) {
          return origin;
        }
        return null;
      },
      maxAge: 3600, // 1 hour cache for browsers to not send preflight requests
      credentials: true, // Allow cookies to be sent with requests
    });

    // To access environment variables in middleware, we need to write it this way.
    // https://github.com/honojs/hono/issues/895#issuecomment-1431012601
    return corsMiddleware(c, next);
  });
