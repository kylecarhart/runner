import { generateRandomString } from "@oslojs/crypto/random";
import { CreateUserRequest } from "@runner/api";
import { eq } from "drizzle-orm";
import { users } from "../../app/users/users.schema.js";
import { findUniqueUser } from "../../app/users/users.service.js";
import { db } from "../../database/db.js";
import { sendEmailConfirmation } from "../../email/email.service.js";
import { lower } from "../../utils/drizzle.js";
import { invariant } from "../../utils/invariant.js";
import { logger } from "../../utils/logger.js";
import { hours } from "../../utils/ms.js";
import { hashPassword } from "../password/password.service.js";
import { emailConfirmations } from "./email-confirmations.schema.js";

const EXPIRATION_TIME = hours(1);

/**
 * Initialize a user signup
 * @param createUserRequest User to sign up
 */
export async function initUserSignup(createUserRequest: CreateUserRequest) {
  const { email, username, password } = createUserRequest;
  logger().info("Initializing user signup", { username, email });

  // Check if email or username is already taken
  const uniqueUser = await findUniqueUser({ email, username });
  if (uniqueUser?.email === email.toLowerCase()) {
    throw new Error("Email already taken.");
  } else if (uniqueUser?.username === username.toLowerCase()) {
    throw new Error("Username already taken.");
  }

  // Create user and email confirmation in a transaction
  const userId = await db().transaction(async (tx) => {
    // Create user
    logger().debug("Creating user.", { email, username });
    const hashedPassword = await hashPassword(password);
    const userId = (
      await tx
        .insert(users)
        .values({ email, username, password: hashedPassword })
        .returning({ id: users.id })
    ).at(0)?.id;

    invariant(userId, "Failed to create user.");

    // Create code and insert into db
    logger().debug("Creating email confirmation", { userId });
    const code = getRandomEmailConfirmationCode();
    await tx.insert(emailConfirmations).values({
      userId,
      code,
      expiresAt: new Date(Date.now() + EXPIRATION_TIME),
    });

    // Send the confirmation email
    logger().debug("Sending email confirmation", { email, code });
    await sendEmailConfirmation(email, code);

    return userId;
  });

  logger().info("User signed up.", { userId });
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

  // Check if code is valid
  const userWithEmailConfirmation = await db().query.users.findFirst({
    with: { emailConfirmation: true },
    where: eq(lower(users.email), email.toLowerCase()), // Email matches
    columns: { password: false }, // Exclude password
  });

  // Code doesn't match or expired
  if (
    userWithEmailConfirmation?.emailConfirmation?.code !== code ||
    userWithEmailConfirmation?.emailConfirmation?.expiresAt < new Date()
  ) {
    return false;
  }

  await db().transaction(async (tx) => {
    // Delete the email confirmation
    await tx
      .delete(emailConfirmations)
      .where(
        eq(
          emailConfirmations.id,
          userWithEmailConfirmation.emailConfirmation.id,
        ),
      );

    // Update the user to be confirmed
    await tx
      .update(users)
      .set({ confirmedAt: new Date().toISOString() })
      .where(eq(users.id, userWithEmailConfirmation.id));
  });

  return true;
}
