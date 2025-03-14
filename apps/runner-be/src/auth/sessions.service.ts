import { sha256 } from "@noble/hashes/sha256";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { addDays, isAfter, subDays } from "date-fns";
import { eq } from "drizzle-orm";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { User, users, withoutPassword } from "../app/users/users.schema.js";
import { db } from "../database/db.js";
import { HonoContext } from "../index.js";
import { env, isDevelopment } from "../utils/env.js";
import { logger } from "../utils/logger.js";
import { Session, sessions } from "./sessions.schema.js";

/**
 * Generates a cryptographically secure random session token.
 * The token is encoded as a base32 string (lowercase, no padding).
 * @returns A random session token string
 */
export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

/**
 * Creates a new session for a user.
 * The session token is hashed using SHA-256 to create the session ID.
 * The session expires after 30 days.
 * TODO: Eventually move to Redis!
 * @param token - The session token to associate with this session
 * @param userId - The ID of the user this session belongs to
 * @returns The created session object
 */
export async function createSession(
  token: string,
  userId: string,
): Promise<Session> {
  // Hash the token to create the session ID
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  // Create the session object
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: addDays(new Date(), 30).toISOString(),
  };

  // Upsert the session into the database
  await db()
    .insert(sessions)
    .values(session)
    .onConflictDoUpdate({
      target: [sessions.userId],
      set: {
        id: session.id,
        expiresAt: session.expiresAt,
      },
    });

  return session;
}

/**
 * Validates a session token and returns the associated session and user if valid.
 * - Returns null for both session and user if the token is invalid
 * - Automatically deletes expired sessions
 * - Extends the session expiration time if it's within 15 days of expiring
 * @param token - The session token to validate
 * @returns An object containing the session and user if valid, or null values if invalid
 */
export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  logger().trace("validateSessionToken", { sessionId });
  // Query for session and user
  const results = await db()
    .select({ user: withoutPassword, session: sessions })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId));

  logger().trace("validateSessionToken results", { results });

  // If the session does not exist, return null
  const result = results.at(0);
  if (!result) {
    return { session: null, user: null };
  }

  const { user, session } = result;

  // If the session has expired, delete it and return null
  if (isAfter(Date.now(), session.expiresAt)) {
    await db().delete(sessions).where(eq(sessions.id, session.id));
    return { session: null, user: null };
  }

  // If the session is expiring soon, update it to extend the expiration date
  if (isAfter(Date.now(), subDays(session.expiresAt, 15))) {
    session.expiresAt = addDays(session.expiresAt, 30).toISOString();
    await db()
      .update(sessions)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(sessions.id, session.id));
  }
  return { session, user };
}

/**
 * Invalidates (deletes) a session by its ID.
 * @param sessionId - The ID of the session to invalidate
 */
export async function invalidateSession(token: string): Promise<void> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  await db().delete(sessions).where(eq(sessions.id, sessionId));
}

/**
 * Represents the result of validating a session token.
 * Either contains both a valid session and its associated user,
 * or null values for both if the session is invalid.
 */
export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

/**
 * Gets the session cookie from the context
 * @param c - The Hono context
 * @returns The session cookie value or undefined if not found
 */
export function getSessionCookie(c: HonoContext): string | undefined {
  return getCookie(c, "session");
}

/**
 * Sets the session cookie
 * @param c - The Hono context
 * @param token - The session token
 * @param session - The session object
 */
export function setSessionCookie(
  c: HonoContext,
  token: string,
  session: Session,
) {
  setCookie(c, "session", token, {
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(session.expiresAt),
    path: "/",
    secure: isDevelopment() ? false : true,
    domain: new URL(env().ALLOWED_ORIGIN).hostname, // TODO: Is this always right?
  });
}

/**
 * Deletes the session cookie
 * @param c - The Hono context
 */
export function deleteSessionCookie(c: HonoContext) {
  deleteCookie(c, "session", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
    secure: isDevelopment() ? false : true,
    domain: new URL(env().ALLOWED_ORIGIN).hostname, // TODO: Is this always right?
  });
}
