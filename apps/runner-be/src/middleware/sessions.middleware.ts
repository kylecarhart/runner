import { createMiddleware } from "hono/factory";
import {
  deleteSessionCookie,
  getSessionCookie,
  setSessionCookie,
  validateSessionToken,
} from "../auth/sessions.service.js";
import { HonoEnv } from "../index.js";

/**
 * Sessions middleware that sets the session token cookie and user on the context.
 * @returns Hono sessions middleware
 */
export const sessionsMiddleware = () =>
  createMiddleware<HonoEnv>(async (c, next) => {
    // Get session token
    const token = getSessionCookie(c);
    if (!token) {
      // c.status(401);
      // return c.body("Unauthorized");
      return await next();
    }

    // Validate session token
    const { session, user } = await validateSessionToken(token);
    if (session === null) {
      deleteSessionCookie(c);
      // c.status(401);
      // return c.body("Unauthorized");
      return await next();
    }

    // Set session token cookie
    setSessionCookie(c, token, session);

    // Set user
    c.set("user", user);

    return await next();
  });
