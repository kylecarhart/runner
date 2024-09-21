import { CreateUserRequest } from "@runner/api";
import { db } from "../database/db";
import { User, users } from "./users.schema";

// export function findOne(id: User["id"]): Promise<UserWithoutPassword | null> {
//   return this.usersRepository.findOneBy({ id });
// }

// export function findOneWithPassword(id: User["id"]): Promise<User | null> {
//   return this.usersRepository
//     .createQueryBuilder("user")
//     .addSelect("user.password")
//     .where("user.id = :id", { id })
//     .getOne();
// }

// export function findOneByUsername(
//   username: User["username"],
// ): Promise<UserWithoutPassword | null> {
//   return this.usersRepository.findOneBy({ username });
// }

// export function findOneByUsernameWithPassword(
//   username: User["username"],
// ): Promise<User | null> {
//   return this.usersRepository
//     .createQueryBuilder("user")
//     .addSelect("user.password")
//     .where("user.username = :username", { username })
//     .getOne();
// }

export function createUser(
  createUserRequest: CreateUserRequest,
): Promise<User[]> {
  return db.insert(users).values(createUserRequest).returning();
}

// export async function update(
//   id: string,
//   updateUserDto: UpdateUserDto,
// ): Promise<UserWithoutPassword> {
//   await this.usersRepository.update(id, updateUserDto);
//   return this.usersRepository.findOneByOrFail({ id });
// }

// export async function remove(id: User["id"]): Promise<void> {
//   await this.usersRepository.delete(id);
// }

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
