import { z, ZodRawShape } from "./zod.js";

/** Base id field */
export const idField = { id: z.string().uuid() };

/** Base audit fields */
export const auditFields = {
  createdAt: z.string(),
  updatedAt: z.string(),
};

/** Base fields for all models */
export const baseFields = {
  ...idField,
  ...auditFields,
};

/**
 * Add id and audit fields to a schema
 * TODO: This is causing TS error: type instantiation is excessively deep and possibly infinite
 * @param zodRawShape - The schema to add id and audit fields to
 * @returns The schema with id and audit fields
 */
export function toSchemaWithBaseFields<T extends ZodRawShape>(zodRawShape: T) {
  return z.object({
    ...idField,
    ...zodRawShape,
    ...auditFields,
  });
}

/**
 * @deprecated YOU PROBABLY DON'T WANT THIS. USE PICK INSTEAD. ITS EASIER TO READ.
 */
export const omitBaseFields = {
  id: true,
  createdAt: true,
  updatedAt: true,
} satisfies { [key in keyof typeof baseFields]: true };
