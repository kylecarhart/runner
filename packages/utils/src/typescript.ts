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
