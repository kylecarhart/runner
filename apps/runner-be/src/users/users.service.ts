import { CreateUserRequest, UpdateUserRequest } from "@runner/api";
import * as argon2 from "argon2";
import { and, eq } from "drizzle-orm";
import { PostgresError } from "postgres";
import { db } from "../database/db";
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
}

// export async function changePassword(
//   id: User["id"],
//   changePasswordDto: ChangePasswordDto,
// ) {
//   const { oldPassword, password, confirmPassword } = changePasswordDto;

//   // Check if new password and confirm password match
//   if (password !== confirmPassword) {
//     throw new Error("Passwords do not match");
//   }

//   // Get the user with password
//   const user = await this.findOneWithPassword(id);

//   // Check if old password is correct
//   const isOldPasswordMatch = await argon2.verify(user.password, oldPassword);
//   if (!isOldPasswordMatch) {
//     throw new Error("Old password is incorrect");
//   }

//   // Hash and update password
//   const hashedPassword = await argon2.hash(password);
//   await this.usersRepository.update(id, { password: hashedPassword });
// }

export const usersService = {
  createUser,
  getUserById,
  queryUsers,
  updateUser,
  deleteUser,
};
