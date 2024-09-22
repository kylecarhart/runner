import {
  ChangePasswordRequest,
  CreateUserRequest,
  UpdateUserRequest,
} from "@runner/api";
import * as argon2 from "argon2";
import { and, eq } from "drizzle-orm";
import { PostgresError } from "postgres";
import { db } from "../database/db";
import { AuthenticationError } from "../errors/AuthenticationError";
import { ConstraintError } from "../errors/ConstraintError";
import { NotFoundError } from "../errors/NotFoundError";
import { queryModel } from "../utils/drizzle";
import { logger } from "../utils/logger";
import {
  INDEX_UNIQUE_EMAIL,
  INDEX_UNIQUE_USERNAME,
  User,
  users,
} from "./users.schema";

const userServiceLogger = logger.child({ service: "users" });

/**
 * Get user by id.
 * @param id User id
 * @returns User
 * @throws NotFoundError if user is not found.
 */
async function getUserById(id: string): Promise<User> {
  userServiceLogger.debug("getUserById", { id });
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: { password: false },
  });

  if (!user) {
    throw new NotFoundError("User", { id });
  }

  return user;
}

/**
 * Query users with pagination
 * @param user User fields to search
 * @param offset Pagination offset
 * @returns Paginated list of users
 */
async function queryUsers(user: Partial<User>, offset = 0): Promise<User[]> {
  userServiceLogger.debug("queryUsers", { user, offset });
  const wheres = queryModel(users, user);

  return db.query.users.findMany({
    limit: 10,
    offset,
    columns: {
      password: false,
    },
    ...(wheres.length > 0 && { where: and(...wheres) }), // TODO: fix this
  });
}

/**
 * Create a new user
 * @param createUserRequest User fields
 * @returns Created user
 */
async function createUser(createUserRequest: CreateUserRequest): Promise<User> {
  try {
    userServiceLogger.debug("createUser", createUserRequest);

    const hashedPassword = await argon2.hash(createUserRequest.password);

    // TODO: Ideally I don't ever want the password returned from the db.
    const { password, ...user } = (
      await db
        .insert(users)
        .values({ ...createUserRequest, password: hashedPassword })
        .returning()
    )[0];

    userServiceLogger.info("User created", { id: user.id });

    return user;
  } catch (e) {
    // TODO: Abstract this out to a common constraint error handler
    if (e instanceof PostgresError) {
      if (e.constraint_name === INDEX_UNIQUE_USERNAME) {
        throw new ConstraintError(
          "Username already exists.",
          e.constraint_name,
        );
      } else if (e.constraint_name === INDEX_UNIQUE_EMAIL) {
        throw new ConstraintError(
          "Email already exists.",
          e.constraint_name,
          createUserRequest,
        );
      }
    }
    throw e;
  }
}

/**
 * Update a user
 * @param id User id
 * @param updateUserRequest User fields to update
 * @returns Updated user
 */
async function updateUser(
  id: string,
  updateUserRequest: UpdateUserRequest,
): Promise<User> {
  try {
    userServiceLogger.debug("updateUser", updateUserRequest);

    // TODO: Ideally I don't ever want the password returned from the db.
    const updatedUser = (
      await db
        .update(users)
        .set(updateUserRequest)
        .where(eq(users.id, id))
        .returning()
    )[0];

    if (!updatedUser) {
      throw new NotFoundError("User", { id });
    }

    userServiceLogger.info("User updated", { id });

    const { password, ...user } = updatedUser;
    return user;
  } catch (e) {
    // TODO: Abstract this out to a common constraint error handler
    if (e instanceof PostgresError) {
      if (e.constraint_name === INDEX_UNIQUE_USERNAME) {
        throw new ConstraintError(
          "Username already exists.",
          e.constraint_name,
        );
      } else if (e.constraint_name === INDEX_UNIQUE_EMAIL) {
        throw new ConstraintError("Email already exists.", e.constraint_name);
      }
    }
    throw e;
  }
}

/**
 * Delete a user
 * @param id User id
 */
async function deleteUser(id: string): Promise<void> {
  userServiceLogger.debug("deleteUser", { id });
  const user = (await db.delete(users).where(eq(users.id, id)).returning())[0];

  if (!user) {
    throw new NotFoundError("User", { id });
  }

  userServiceLogger.info("User deleted", { id });
}

/**
 * Change user password
 * @param id User id
 * @param changePasswordRequest Object containing old and new password
 */
export async function changePassword(
  id: string,
  changePasswordRequest: ChangePasswordRequest,
): Promise<void> {
  userServiceLogger.debug("changePassword", { id });
  const { oldPassword, password } = changePasswordRequest;

  // Get the user with password
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!user) {
    throw new NotFoundError("User", { id });
  }

  // Check if old password is correct
  const isOldPasswordMatch = await argon2.verify(user.password, oldPassword);
  if (!isOldPasswordMatch) {
    throw new AuthenticationError(
      `Incorrect old password on change password request for user ${id}.`,
    );
  }

  // TODO: Check if the new password is the same as the old password
  // if (password === oldPassword) {
  //   throw new ApplicationError({
  //     apiMessage: "New password cannot be the same as old password.",
  //   });
  // }

  // Hash and update password
  const hashedPassword = await argon2.hash(password);
  await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, id));
  userServiceLogger.info("Password changed", { id });
}

export const usersService = {
  createUser,
  getUserById,
  queryUsers,
  updateUser,
  deleteUser,
  changePassword,
};
