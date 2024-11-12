import { scryptAsync } from "@noble/hashes/scrypt";
import { constantTimeEqual } from "@oslojs/crypto/subtle";
import { decodeHex, encodeHexLowerCase } from "@oslojs/encoding";
import {
  HashPasswordFunction,
  VerifyPasswordFunction,
} from "./password.service.js";

/**
 * Scrypt best practice minimum params:
 * @see https://thecopenhagenbook.com/password-authentication
 */
const SCRYPT_PARAMS = {
  N: 16384, // cpu/mem work factor
  r: 16, // block size
  p: 1, // parallelization factor
  dkLen: 64, // derived key length
};

/**
 * Hash a password. Based heavily on Lucia's implementation.
 * @see https://github.com/lucia-auth/lucia/blob/v3/packages/lucia/src/crypto.ts
 * @param password Password to hash
 * @returns Hashed password
 */
export const hashPasswordScrypt: HashPasswordFunction = async (
  password: string,
) => {
  // Normalize the password
  const normalizedPassword = password.normalize("NFKC");

  // Generate a random salt
  const salt = encodeHexLowerCase(crypto.getRandomValues(new Uint8Array(16)));

  // Encode the password and salt
  const encodedPassword = new TextEncoder().encode(normalizedPassword);
  const encodedSalt = new TextEncoder().encode(salt);

  // Hash the password
  const key = await scryptAsync(encodedPassword, encodedSalt, SCRYPT_PARAMS);
  // const key = new Uint8Array(keyUint8Array); // TODO: Use this?

  // Return the salt and the hashed password
  return `${salt}:${encodeHexLowerCase(key)}`;
};

/**
 * Verify a password. Based heavily on Lucia's implementation.
 * @see https://github.com/lucia-auth/lucia/blob/v3/packages/lucia/src/crypto.ts
 * @param password Password to verify
 * @param hash Hashed password
 * @returns True if the password is correct, false otherwise
 */
export const verifyPasswordScrypt: VerifyPasswordFunction = async (
  password,
  hash,
) => {
  // Split the hash into salt and key
  const [salt, key] = hash.split(":");
  if (!salt || !key) {
    return false;
  }

  // Normalize the password
  const normalizedPassword = password.normalize("NFKC");

  // Encode the password and salt
  const encodedPassword = new TextEncoder().encode(normalizedPassword);
  const encodedSalt = new TextEncoder().encode(salt);

  // Hash the password
  const targetKey = await scryptAsync(
    encodedPassword,
    encodedSalt,
    SCRYPT_PARAMS,
  );
  return constantTimeEqual(targetKey, decodeHex(key));
};
