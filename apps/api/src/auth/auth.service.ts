import { eq } from "drizzle-orm";
import { User, users } from "../app/users/users.schema.js";
import { db } from "../database/db.js";
import { lower } from "../utils/drizzle.js";
import { logger } from "../utils/logger.js";
import { verifyPassword } from "./password/password.service.js";

const authLogger = () =>
  logger().child({
    service: "auth",
  });

/**
 * Authenticate user by email and password.
 * @param email Email
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
    where: eq(lower(users.email), email.toLowerCase()),
  });
  if (!userToAuthenticate) {
    return; // User not found
  }

  // Check if password is correct
  const isPasswordMatch = await verifyPassword(
    password,
    userToAuthenticate.password,
  );
  if (!isPasswordMatch) {
    return; // Password is incorrect
  }

  authLogger().info("User authenticated", { email });

  const { password: _, ...user } = userToAuthenticate; // Remove password from user
  return user;
}
