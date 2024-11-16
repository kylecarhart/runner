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
 * @returns User or undefined if authentication fails
 */
export async function authenticateUser(
  email: string,
  password: string,
): Promise<User | undefined> {
  authLogger().debug("authenticateUser", { email });

  // Find user to authenticate
  const userToAuthenticate = await db().query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!userToAuthenticate) {
    return;
  }

  // Check if password is correct
  const isPasswordMatch = await verifyPassword(
    password,
    userToAuthenticate.password,
  );
  if (!isPasswordMatch) {
    return;
  }

  authLogger().info("User authenticated", { email });

  const { password: _, ...user } = userToAuthenticate; // Remove password from user
  return user;
}
