/**
 * Creates a type where all properties of T are optional and can be undefined.
 * Similar to TypeScript's built-in Partial<T>, but explicitly includes undefined
 * as a possible value for each property.
 *
 * This type aligns with Zod's behavior when creating partial schemas using .partial(),
 * where fields become optional and can accept undefined values. This makes it ideal
 * for typing objects that will be validated with Zod partial schemas.
 *
 * @example
 * interface User {
 *   name: string;
 *   age: number;
 * }
 *
 * // Results in { name?: string | undefined; age?: number | undefined }
 * type OptionalUser = LoosePartial<User>;
 */
export type LoosePartial<T> = { [P in keyof T]?: T[P] | undefined };

/**
 * Creates a type where all properties of T are optional but cannot be undefined.
 * Similar to TypeScript's built-in Partial<T>, but explicitly removes undefined
 * as a possible value for each property.
 *
 * This type is useful when you want optional properties that must have valid values
 * when they are present, preventing undefined assignments.
 *
 * @example
 * interface User {
 *   name: string;
 *   age: number | undefined;
 * }
 *
 * // Results in { name?: string; age?: number }
 * // Note: even though age was 'number | undefined', StrictPartial removes undefined
 * type OptionalUser = StrictPartial<User>;
 */
export type StrictPartial<T> = {
  [P in keyof T]?: NonNullable<T[P]>;
};

/**
 * Creates a simplified representation of complex types by flattening intersections
 * and showing the full expanded type in IDE tooltips.
 *
 * This type is particularly useful when working with complex intersection types
 * or mapped types where you want to see the final resolved type structure rather
 * than the intermediate type operations.
 *
 * @example
 * type UserBase = { id: number; name: string };
 * type UserExtras = { age: number; email: string };
 *
 * // Without Prettify: { id: number; name: string } & { age: number; email: string }
 * type User = UserBase & UserExtras;
 *
 * // With Prettify: { id: number; name: string; age: number; email: string }
 * type PrettifiedUser = Prettify<UserBase & UserExtras>;
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
