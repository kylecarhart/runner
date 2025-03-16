/**
 * Default error for invariant errors if none is provided.
 */
class InvariantError extends Error {
  constructor(message: string) {
    super(`Invariant Error: ${message}`);
  }
}

/**
 * Used to assert that the `condition` is truthy. Particularly useful for
 * cleaning up lines and narrowing types.
 *
 * @example
 *
 * ```ts
 * const value: Person | null = { name: 'Alex' };
 * invariant(value, 'Expected value to be a person');
 * // type of `value`` has been narrowed to `Person`
 * ```
 */
export function invariant(condition: unknown, msg: string): asserts condition;
export function invariant(condition: unknown, error: Error): asserts condition;
export function invariant(
  condition: unknown,
  msgOrError: string | Error,
): asserts condition {
  if (condition) {
    return;
  }

  // TODO: Look into if it is expensive or not to be creating the Error object all the time when doing an invariant check.
  if (msgOrError instanceof Error) {
    throw msgOrError;
  }

  throw new InvariantError(msgOrError);
}
