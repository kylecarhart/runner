import { createMiddleware } from "hono/factory";
import {
  deleteSessionCookie,
  getSessionCookie,
  setSessionCookie,
  validateSessionToken,
} from "../auth/sessions.service.js";
import { HonoEnv } from "../index.js";

/**
 * Database middleware
 * @returns Hono middleware
 */
export const sessionMiddleware = () =>
  createMiddleware<HonoEnv>(async (c, next) => {
    // CSRF protection
    if (c.req.method !== "GET") {
      const origin = c.req.header("Origin");
      // You can also compare it against the Host or X-Forwarded-Host header.
      if (origin === null || origin !== "https://example.com") {
        return c.status(403);
      }
    }

    // Get session token
    const token = getSessionCookie(c);
    if (!token) {
      return c.status(401);
    }

    // Validate session token
    const { session, user } = await validateSessionToken(token);
    if (session === null) {
      deleteSessionCookie(c);
      return c.status(401);
    }

    // Set session token cookie
    setSessionCookie(c, token, session);

    // Set user
    c.set("user", user);

    await next();
  });
