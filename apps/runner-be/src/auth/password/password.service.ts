import { hashPasswordScrypt, verifyPasswordScrypt } from "./scrypt.service.js";

export type HashPasswordFunction = (password: string) => Promise<string>;

/**
 * Hash a password. Based heavily on Lucia's implementation.
 * @param password Password to hash
 * @returns Hashed password
 */
export const hashPassword: HashPasswordFunction = async (password: string) => {
  return hashPasswordScrypt(password);
};

export type VerifyPasswordFunction = (
  password: string,
  hash: string,
) => Promise<boolean>;

/**
 * Verify a password
 * @param password Password to verify
 * @param hash Hashed password
 * @returns True if the password is correct, false otherwise
 */
export const verifyPassword: VerifyPasswordFunction = async (
  password,
  hash,
) => {
  return verifyPasswordScrypt(password, hash);
};
