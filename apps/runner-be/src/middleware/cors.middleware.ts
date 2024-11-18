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
    const corsMiddleware = cors({
      origin: isDevelopment() ? "*" : env().ALLOWED_ORIGIN, // Does not send "Access-Control-Allow-Origin" if theres no match.
      maxAge: 3600, // 1 hour cache for browsers to not send preflight requests
      credentials: true, // Allow cookies to be sent with requests
    });

    return corsMiddleware(c, next);
  });
