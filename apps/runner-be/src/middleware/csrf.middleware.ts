import { csrf } from "hono/csrf";
import { createMiddleware } from "hono/factory";
import { HonoEnv } from "../index.js";
import { env, isDevelopment } from "../utils/env.js";

// Only allow localhost if we're in development the origin is localhost
const allowLocalhost = (origin: string) =>
  isDevelopment() && origin.startsWith("http://localhost:");

/**
 * CSRF protection middleware.
 * @returns Hono CSRF middleware
 */
export const csrfMiddleware = () =>
  createMiddleware<HonoEnv>((c, next) => {
    const allowedOrigins = { [env().ALLOWED_ORIGIN]: true };

    // Allow requests from the allowed origins
    const csrfMiddleware = csrf({
      origin: (origin) => allowedOrigins[origin] || allowLocalhost(origin),
    });

    return csrfMiddleware(c, next);
  });
