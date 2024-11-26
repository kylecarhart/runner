import { csrf } from "hono/csrf";
import { createMiddleware } from "hono/factory";
import { HonoEnv } from "../index.js";
import { env, isDev } from "../utils/env.js";

/**
 * CSRF protection middleware.
 * @returns Hono CSRF middleware
 */
export const csrfMiddleware = () =>
  createMiddleware<HonoEnv>((c, next) => {
    const csrfMiddleware = csrf({
      ...(!isDev() && { origin: env().ALLOWED_ORIGIN }), // Strict CSRF protection only in production
    });

    return csrfMiddleware(c, next);
  });
