import { z, ZodSchema } from "zod";

const PaginationSchema = z.object({
  limit: z.number(),
  page: z.number(),
  nextPage: z.number(),
  prevPage: z.number(),
  total: z.number(), // Total number of records
});

export const SuccessResponseSchema = z.object({
  success: z.literal(true),
  message: z.string().optional(),
});

const ErrorResponseSchema = z.object({
  success: z.literal(false),
  code: z.string(),
  message: z.string(),
  data: z.unknown().optional(),
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

/**
 * Wrap a schema in a success response
 */
export function withSuccess<T extends ZodSchema>(schema: T) {
  return SuccessResponseSchema.extend({
    data: schema,
  });
}

/**
 * Wrap a schema in a success response with pagination
 */
export function withPagination<T extends ZodSchema>(schema: T) {
  return SuccessResponseSchema.extend({
    data: schema,
    pagination: PaginationSchema,
  });
}
