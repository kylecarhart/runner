import { z, ZodObject, ZodSchema } from "zod";

export const PaginationSchema = z.object({
  limit: z.number(),
  page: z.number(),
  nextPage: z.number().nullable(),
  prevPage: z.number().nullable(),
  total: z.number(), // Total number of records
});
export type Pagination = z.infer<typeof PaginationSchema>;

export const SuccessResponseSchema = z
  .object({
    success: z.literal(true),
    message: z.string().optional(),
  })
  .openapi("SuccessResponse");

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  code: z.string(),
  message: z.string(),
  data: z.unknown().optional(),
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

/**
 * Wrap a schema in a success response
 */
export function withSuccessSchema<T extends ZodSchema>(
  schema: T,
): ZodObject<(typeof SuccessResponseSchema)["shape"]> {
  return SuccessResponseSchema.extend({
    data: schema,
  }).openapi("SuccessResponse");
}

/**
 * Wrap a schema in a success response with pagination
 */
export function withPaginationSchema<T extends ZodSchema>(schema: T) {
  return SuccessResponseSchema.extend({
    data: schema,
    pagination: PaginationSchema,
  });
}
