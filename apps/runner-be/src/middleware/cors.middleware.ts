import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";
import { HonoEnv } from "../index.js";
import { env, isDevelopment } from "../utils/env.js";

/**
 * Cross Origin Resource Sharing (CORS) middleware.
 * @returns Hono CORS middleware
 */
export const corsMiddleware = () =>
  createMiddleware<HonoEnv>((c, next) => {
    const origins = [env().ALLOWED_ORIGIN];

    if (isDevelopment()) {
      origins.push("http://localhost:4321"); // Add localhost if not in production
    }

    const corsMiddleware = cors({
      origin: origins, // Does not send "Access-Control-Allow-Origin" if theres no match.
      maxAge: 3600, // 1 hour cache for browsers to not send preflight requests
      credentials: true, // Allow cookies to be sent with requests
    });

    // To access environment variables in middleware, we need to write it this way.
    // https://github.com/honojs/hono/issues/895#issuecomment-1431012601
    return corsMiddleware(c, next);
  });
