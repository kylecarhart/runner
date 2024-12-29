import { generateRandomString } from "@oslojs/crypto/random";
import { CreateUserRequest } from "@runner/api";
import { addHours, isAfter } from "date-fns";
import { eq } from "drizzle-orm";
import { User, users, withoutPassword } from "../../app/users/users.schema.js";
import { findUniqueUser } from "../../app/users/users.service.js";
import { db } from "../../database/db.js";
import { sendEmailConfirmation } from "../../email/email.service.js";
import { lower } from "../../utils/drizzle.js";
import { invariant } from "../../utils/invariant.js";
import { logger } from "../../utils/logger.js";
import { hashPassword } from "../password/password.service.js";
import { emailConfirmations } from "./email-confirmations.schema.js";

/**
 * Initialize a user signup
 * @param createUserRequest User to sign up
 */
export async function initUserSignup(
  createUserRequest: CreateUserRequest,
): Promise<User> {
  const { email, username, password } = createUserRequest;
  logger().info("Initializing user signup.", { username, email });

  // Check if email or username is already taken
  const uniqueUser = await findUniqueUser({ email, username });
  if (uniqueUser?.email === email.toLowerCase()) {
    throw new Error("Email already taken.");
  } else if (uniqueUser?.username === username.toLowerCase()) {
    throw new Error("Username already taken.");
  }

  // Create user and email confirmation in a transaction
  const user = await db().transaction(async (tx) => {
    // Create user
    logger().debug("Creating user.", { email, username });
    const hashedPassword = await hashPassword(password);
    const user = (
      await tx
        .insert(users)
        .values({ email, username, password: hashedPassword })
        .returning(withoutPassword)
    ).at(0);

    invariant(user, "Failed to create user.");

    // Create code and insert into db
    logger().debug("Creating email confirmation.", { userId: user.id });
    const code = getRandomEmailConfirmationCode();
    await tx.insert(emailConfirmations).values({
      userId: user.id,
      code,
      expiresAt: addHours(new Date(), 1).toISOString(),
    });

    // Send the confirmation email
    await sendEmailConfirmation(email, code);

    return user;
  });

  logger().info("User created and confirmation email initiated successfully.", {
    userId: user.id,
  });
  return user;
}

/**
 * Generate a random email confirmation code
 * @returns Random email confirmation code
 */
function getRandomEmailConfirmationCode() {
  return generateRandomString(
    {
      read(bytes) {
        crypto.getRandomValues(bytes); // method of getting random values
      },
    },
    "0123456789", // alphabet
    6, // length
  );
}

/**
 * Confirm an email
 * @param email - The email address to confirm
 * @param code - The code to confirm
 * @returns True if the email was successfully confirmed, false otherwise
 */
export async function confirmEmail(
  email: string,
  code: string,
): Promise<boolean> {
  logger().debug("Confirming email", { email, code });

  // Get user with email confirmation
  const userWithEmailConfirmation = await db().query.users.findFirst({
    with: { emailConfirmation: true },
    where: eq(lower(users.email), email.toLowerCase()), // Email matches
    columns: { password: false }, // Exclude password
  });

  // Check if email confirmation exists for user
  if (!userWithEmailConfirmation) {
    logger().trace("Email confirmation does not exist for user", { email });
    return false;
  }

  const { emailConfirmation, ...user } = userWithEmailConfirmation;

  // Check for invalid email confirmation
  if (
    user.confirmedAt || // User is already confirmed
    emailConfirmation?.code !== code || // Code is wrong
    isAfter(new Date(), emailConfirmation.expiresAt) // Code is expired
  ) {
    logger().trace("Invalid email confirmation", { email });
    return false;
  }

  await db().transaction(async (tx) => {
    // Delete the email confirmation
    await tx
      .delete(emailConfirmations)
      .where(eq(emailConfirmations.id, emailConfirmation.id));

    // Update the user to be confirmed
    await tx
      .update(users)
      .set({ confirmedAt: new Date().toISOString() })
      .where(eq(users.id, user.id));
  });

  logger().info("Email confirmed successfully", { email });

  return true;
}
