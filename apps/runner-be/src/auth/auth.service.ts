import { eq } from "drizzle-orm";
import { User, users } from "../app/users/users.schema.js";
import { db } from "../database/db.js";
import { logger } from "../utils/logger.js";
import { verifyPassword } from "./password/password.service.js";

const authLogger = () =>
  logger().child({
    service: "auth",
  });

/**
 * Authenticate user by username and password. Used with passport.js.
 * @param username Username
 * @param password Password
 * @returns User or false if authentication fails
 */
export async function authenticateUser(
  username: string,
  password: string,
): Promise<User | false> {
  authLogger().debug("authenticateUser", { username });

  // Find user to authenticate
  const userToAuthenticate = await db().query.users.findFirst({
    where: eq(users.username, username),
  });
  if (!userToAuthenticate) {
    return false;
  }

  // Check if password is correct
  const isPasswordMatch = await verifyPassword(
    password,
    userToAuthenticate.password,
  );
  if (!isPasswordMatch) {
    return false;
  }

  authLogger().info("User authenticated", { username });

  const { password: _, ...user } = userToAuthenticate; // Remove password from user
  return user;
}
