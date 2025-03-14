import { createMiddleware } from "hono/factory";
import {
  deleteSessionCookie,
  getSessionCookie,
  validateSessionToken,
} from "../auth/sessions.service.js";
import { HonoEnv } from "../index.js";
import { logger } from "../utils/logger.js";

/**
 * Sessions middleware that sets the session token cookie and user on the context.
 * @returns Hono sessions middleware
 */
export const sessionsMiddleware = () =>
  createMiddleware<HonoEnv>(async (c, next) => {
    // Check if user sent a session token
    const token = getSessionCookie(c);
    if (!token) {
      c.status(401);
      return c.body("Unauthorized");
    }
    logger().trace("sessionsMiddleware token found");

    // Check if the session token is valid
    const { session, user } = await validateSessionToken(token);
    if (session === null) {
      deleteSessionCookie(c);
      c.status(401);
      return c.body("Unauthorized");
    }
    logger().trace("sessionsMiddleware session found");

    // Update logger with user id
    c.set(
      "logger",
      logger().child({
        userId: user?.id,
      }),
    );

    // Set session token cookie
    // setSessionCookie(c, token, session); // TODO: Look at this

    // Set user
    c.set("user", () => {
      if (!user) {
        throw new Error("Unauthorized");
      }
      return user;
    });

    return await next();
  });
