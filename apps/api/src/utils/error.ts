import postgres from "postgres";

/**
 * Handles Postgres errors by mapping them to custom errors based on constraint names.
 * If the error is not a PostgresError or the constraint name is not in the map, it returns early.
 * Otherwise, it throws the mapped error.
 *
 * @param e - The error object, expected to be a PostgresError.
 * @param map - A record mapping constraint names to custom Error objects.
 * @throws The custom Error mapped from the constraint name.
 */
export function handlePostgresConstraintError(
  e: unknown,
  map: Record<string, Error>,
) {
  // return early if it's not a PostgresError
  if (!(e instanceof postgres.PostgresError)) {
    return;
  }

  // return early if the constraint name is not in the map
  if (!e.constraint_name || !(e.constraint_name in map)) {
    return;
  }

  throw map[e.constraint_name];
}
