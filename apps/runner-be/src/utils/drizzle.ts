import { eq, SQL, sql } from "drizzle-orm";
import {
  AnyPgColumn,
  PgTableWithColumns,
  TableConfig,
} from "drizzle-orm/pg-core";

/**
 * Build where clause from partial model properties
 * @param table Drizzle database table
 * @param model Model properties
 * @returns Drizzle where clause
 */
export function queryModel<T extends TableConfig>(
  table: PgTableWithColumns<T>,
  model: Partial<Record<keyof T["columns"], unknown>>, // TODO: Change unknown to actual inferred database column type
) {
  const wheres = [];

  for (const [key, value] of Object.entries(model)) {
    if (typeof value === "string") {
      wheres.push(eq(lower(table[key]), value.toLowerCase())); // TODO: Look more into this, we may not want this in every scenario.
    } else {
      wheres.push(eq(table[key], value));
    }
  }

  return wheres;
}

function withPagination(page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit;
}

/**
 * Lowercase a column for use in SQL queries
 * @param pgColumn Postgres table column
 * @returns SQL lowercasing the column
 */
export function lower(pgColumn: AnyPgColumn): SQL {
  return sql`lower(${pgColumn})`;
}
