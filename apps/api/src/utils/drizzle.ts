import { eq, SQL, sql } from "drizzle-orm";
import {
  AnyPgColumn,
  customType,
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
    const columnKey = key as keyof T["columns"];
    if (typeof value === "string") {
      wheres.push(eq(lower(table[columnKey]), value.toLowerCase())); // TODO: Look more into this, we may not want this in every scenario.
    } else {
      wheres.push(eq(table[columnKey], value));
    }
  }

  return wheres;
}

// function withPagination(page: number = 1, limit: number = 10) {
//   const offset = (page - 1) * limit;
// }

/**
 * Lowercase a column for use in SQL queries
 * @param pgColumn Postgres table column
 * @returns SQL lowercasing the column
 */
export function lower(pgColumn: AnyPgColumn): SQL {
  return sql`lower(${pgColumn})`;
}

/**
 * Custom type for PostgreSQL timestamp with timezone that uses the ISO 8601
 * format instead of RFC 3339. This helps with compatibility with JavaScript
 * Date objects.
 * TODO: Come back and think about this.
 */
export const timestamp8601 = customType<{
  data: string;
  driverData: string;
  config: { withTimezone: boolean; precision?: number };
}>({
  dataType(config) {
    const precision =
      typeof config?.precision !== "undefined" ? ` (${config.precision})` : "";
    return `timestamp${precision}${
      config?.withTimezone ? " with time zone" : ""
    }`;
  },
  fromDriver(value: string): string {
    // TODO: Faster way to do this?
    return new Date(value).toISOString();
  },
});
