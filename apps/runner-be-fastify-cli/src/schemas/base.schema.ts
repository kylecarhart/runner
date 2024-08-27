import { PgColumnBuilderBase, timestamp, uuid } from "drizzle-orm/pg-core";

type Columns = Record<string, PgColumnBuilderBase>;

/**
 * Base schema for all tables.
 */
export const baseSchema = {
  id: uuid("id").primaryKey(),
  createdDate: timestamp("created_date").notNull().defaultNow(),
  updatedDate: timestamp("updated_date")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

/**
 * Adds base columns to a given Drizzle schema.
 * @param columns Drizzle Schema Column
 * @returns Drizzle Schema Columns with base schema
 */
export function withBaseSchema(columns: Columns): Columns {
  return {
    id: baseSchema.id,
    ...columns,
    createdDate: baseSchema.createdDate,
    updatedDate: baseSchema.updatedDate,
  };
}
