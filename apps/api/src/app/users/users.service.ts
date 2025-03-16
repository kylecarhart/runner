import {
  DEFAULT_PAGINATION,
  type PaginationQuery,
} from "@runner/schemas/request";
import { Pagination } from "@runner/schemas/response";
import {
  type ChangePasswordRequest,
  type CreateUserRequest,
  type UpdateUserRequest,
} from "@runner/schemas/user";
import { stripUndefined } from "@runner/utils/object";
import { eq, or } from "drizzle-orm";
import {
  hashPassword,
  verifyPassword,
} from "../../auth/password/password.service.js";
import { db } from "../../database/db.js";
import { AuthenticationError } from "../../errors/AuthenticationError.js";
import { NotFoundError } from "../../errors/NotFoundError.js";
import { lower } from "../../utils/drizzle.js";
import { handlePostgresConstraintError } from "../../utils/error.js";
import { invariant } from "../../utils/invariant.js";
import { logger } from "../../utils/logger.js";
import { paginationHelper } from "../../utils/response.js";
import {
  users,
  UsersErrorMap,
  withoutPassword,
  type User,
} from "./users.schema.js";

const usersLogger = () => logger().child({ service: "users" });

/**
 * Get user by id.
 * @param id User id
 * @returns User
 * @throws NotFoundError if user is not found.
 */
export async function getUserById(id: string): Promise<User> {
  usersLogger().debug("getUserById", { id });

  const user = await db().query.users.findFirst({
    where: eq(users.id, id),
    columns: { password: false },
  });

  invariant(user, new NotFoundError("User not found."));

  usersLogger().info("User found", { id });
  return user;
}

/**
 * Get user by email
 * @param email User email
 * @returns User or undefined if user is not found
 */
export async function getUserByEmail(email: string): Promise<User | undefined> {
  usersLogger().debug("getUserByEmail", { email });

  const user = await db().query.users.findFirst({
    where: eq(lower(users.email), email.toLowerCase()),
    columns: { password: false },
  });

  return user;
}

/**
 * Find a user by email or username
 * @param email User email
 * @param username User username
 * @returns User or undefined if user is not found
 */
export async function findUniqueUser({
  email,
  username,
}: Pick<User, "email" | "username">) {
  return await db().query.users.findFirst({
    where: or(
      eq(lower(users.email), email.toLowerCase()),
      eq(lower(users.username), username.toLowerCase()),
    ),
  });
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
export async function getAllUsers(
  options: PaginationQuery = DEFAULT_PAGINATION,
): Promise<DataWithPagination<User[]>> {
  const { limit, page } = options;
  usersLogger().debug("getAllUsers", { options });

  // TODO: Eventually respect peoples privacy to not show up
  const total = await db().$count(users);
  const data = await db().query.users.findMany({
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
export async function createUser(
  createUserRequest: CreateUserRequest,
): Promise<User> {
  try {
    usersLogger().debug("createUser", createUserRequest);

    const hashedPassword = await hashPassword(createUserRequest.password);

    const createdUser = (
      await db()
        .insert(users)
        .values({ ...createUserRequest, password: hashedPassword })
        .returning(withoutPassword)
    ).at(0);

    invariant(createdUser, "Failed to create user.");

    usersLogger().info("User created", { id: createdUser.id });

    return createdUser;
  } catch (e) {
    handlePostgresConstraintError(e, UsersErrorMap);
    throw e;
  }
}

/**
 * Update a user
 * @param id User id
 * @param updateUserRequest User fields to update
 * @returns Updated user
 */
export async function updateUser(
  id: string,
  updateUserRequest: UpdateUserRequest,
): Promise<User> {
  try {
    usersLogger().debug("updateUser", updateUserRequest);

    const fields = stripUndefined(updateUserRequest); // Remove undefined values

    const updatedUser = (
      await db()
        .update(users)
        .set(fields)
        .where(eq(users.id, id))
        .returning(withoutPassword)
    ).at(0);

    invariant(updatedUser, new NotFoundError("User not found."));

    usersLogger().info("User updated", { id });

    return updatedUser;
  } catch (e) {
    handlePostgresConstraintError(e, UsersErrorMap);
    throw e;
  }
}

/**
 * Delete a user
 * @param id User id
 * @returns Deleted user
 */
export async function deleteUser(id: string): Promise<void> {
  usersLogger().debug("deleteUser", { id });

  const deletedUser = (
    await db().delete(users).where(eq(users.id, id)).returning({ id: users.id })
  ).at(0);

  invariant(deletedUser, new NotFoundError("User not found."));

  usersLogger().info("User deleted", { id });
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
  usersLogger().debug("changePassword", { id });
  const { oldPassword, password } = changePasswordRequest;

  // Get the user with password
  const user = await db().query.users.findFirst({
    where: eq(users.id, id),
  });

  invariant(user, new NotFoundError("User not found."));

  // Check if old password is correct
  const isOldPasswordMatch = await verifyPassword(oldPassword, user.password);

  if (!isOldPasswordMatch) {
    throw new AuthenticationError(
      `Incorrect old password on change password request for user ${id}.`,
    );
  }

  // Hash and update password
  const hashedPassword = await hashPassword(password);
  await db()
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, id));

  usersLogger().info("Password changed successfully", { id });
}
