import {
  DEFAULT_PAGINATION,
  Pagination,
  type ChangePasswordRequest,
  type CreateUserRequest,
  type PaginationQuery,
  type UpdateUserRequest,
} from "@runner/api";
import { stripUndefined } from "@runner/utils";
import * as argon2 from "argon2";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { db } from "../../database/db.js";
import { AuthenticationError } from "../../errors/AuthenticationError.js";
import { ConstraintError } from "../../errors/ConstraintError.js";
import { NotFoundError } from "../../errors/NotFoundError.js";
import { logger } from "../../utils/logger.js";
import { paginationHelper } from "../../utils/response.js";
import {
  INDEX_UNIQUE_EMAIL,
  INDEX_UNIQUE_USERNAME,
  users,
  type User,
} from "./users.schema.js";

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

interface DataWithPagination<T> {
  data: T;
  pagination: Pagination;
}

/**
 * Query users with pagination
 * @param user User fields to search
 * @param offset Pagination offset
 * @returns Paginated list of users
 */
async function getAllUsers(
  options: PaginationQuery = DEFAULT_PAGINATION,
): Promise<DataWithPagination<User[]>> {
  const { limit, page } = options;
  userServiceLogger.debug("getAllUsers", { options });

  // TODO: Eventually respect peoples privacy to not show up
  const total = await db.$count(users);
  const data = await db.query.users.findMany({
    limit,
    offset: (page - 1) * limit,
    columns: {
      password: false,
    },
  });

  return {
    data,
    pagination: paginationHelper({ page, limit, total }),
  };
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
    const createdUser = (
      await db
        .insert(users)
        .values({ ...createUserRequest, password: hashedPassword })
        .returning()
    ).at(0);

    if (!createdUser) {
      throw new Error("Failed to create user."); // TODO: Replace with custom error
    }

    userServiceLogger.info("User created", { id: createdUser.id });

    const { password, ...user } = createdUser;
    return user;
  } catch (e) {
    // TODO: Abstract this out to a common constraint error handler
    if (e instanceof postgres.PostgresError) {
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

    const fields = stripUndefined(updateUserRequest); // Remove undefined values

    // TODO: Ideally I don't ever want the password returned from the db.
    const updatedUser = (
      await db.update(users).set(fields).where(eq(users.id, id)).returning()
    )[0];

    if (!updatedUser) {
      throw new NotFoundError("User", { id });
    }

    userServiceLogger.info("User updated", { id });

    const { password, ...user } = updatedUser;
    return user;
  } catch (e) {
    // TODO: Abstract this out to a common constraint error handler
    if (e instanceof postgres.PostgresError) {
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
 * @returns Deleted user
 */
async function deleteUser(id: string): Promise<User> {
  userServiceLogger.debug("deleteUser", { id });
  const deletedUser = (
    await db.delete(users).where(eq(users.id, id)).returning()
  ).at(0);

  if (!deletedUser) {
    throw new NotFoundError("User", { id });
  }

  userServiceLogger.info("User deleted", { id });
  const { password, ...user } = deletedUser;
  return user;
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
  getAllUsers,
  updateUser,
  deleteUser,
  changePassword,
};
