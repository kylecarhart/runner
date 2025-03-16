import { sql } from "drizzle-orm";
import { PgColumnBuilderBase, uuid } from "drizzle-orm/pg-core";
import { timestamp8601 } from "../utils/drizzle.js";

type PgTableColumns = Record<string, PgColumnBuilderBase>;

const idColumn = {
  id: uuid().defaultRandom().primaryKey(),
} satisfies PgTableColumns;

const auditColumns = {
  createdAt: timestamp8601({ withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp8601({ withTimezone: true })
    .default(sql`now()`)
    .notNull()
    .$onUpdate(() => new Date().toISOString()),
} satisfies PgTableColumns;

/**
 * Wrap postgres table columns with base table columns
 * @param columns Postgres table columns
 * @returns Postgres table schema wrapped with base columns.
 */
export function withBaseSchema<T extends PgTableColumns>(columns: T) {
  return {
    ...idColumn,
    ...columns,
    ...auditColumns,
  };
}
