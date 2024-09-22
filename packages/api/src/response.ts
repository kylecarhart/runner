import { z, ZodSchema } from "zod";

const PaginationSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  pageCount: z.number(),
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

export function withSuccessResponseSchema<T extends ZodSchema>(schema: T) {
  return SuccessResponseSchema.extend({
    data: schema,
  });
}
