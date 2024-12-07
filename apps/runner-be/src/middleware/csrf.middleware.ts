import { csrf } from "hono/csrf";
import { createMiddleware } from "hono/factory";
import { HonoEnv } from "../index.js";
import { env, isDevelopment } from "../utils/env.js";

/**
 * CSRF protection middleware.
 * @returns Hono CSRF middleware
 */
export const csrfMiddleware = () =>
  createMiddleware<HonoEnv>((c, next) => {
    const origins = [env().ALLOWED_ORIGIN];

    if (isDevelopment()) {
      origins.push("http://localhost:4321"); // Add localhost if not in production
    }

    const csrfMiddleware = csrf({
      origin: origins, // Allow requests from the allowed origin
    });

    return csrfMiddleware(c, next);
  });
