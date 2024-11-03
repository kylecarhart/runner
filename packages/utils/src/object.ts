import { Prettify, StrictPartial } from "./typescript.js";

/**
 * Removes all properties with undefined values from an object
 * @param obj - The source object to strip undefined values from
 * @returns A new object with all undefined values removed. Properties in the returned object
 *          will be a subset of the original object's properties.
 * @example
 * const input = { a: 1, b: undefined, c: 'hello' };
 * const result = stripUndefined(input);
 * // result = { a: 1, c: 'hello' }
 */
export function stripUndefined<T extends object>(
  obj: T,
): Prettify<StrictPartial<T>> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as StrictPartial<T>;
}
