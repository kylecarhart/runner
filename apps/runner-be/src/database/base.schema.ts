import { PgColumnBuilderBase, timestamp, uuid } from "drizzle-orm/pg-core";

type PgTableColumns = Record<string, PgColumnBuilderBase>;

const idColumn = {
  id: uuid("id").defaultRandom().primaryKey(),
} satisfies PgTableColumns;

const auditColumns = {
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
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
