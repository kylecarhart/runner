import { z } from "zod";

export const PaginationQuerySchema = z.object({
  limit: z.coerce.number().max(100).optional().default(10),
  page: z.coerce.number().min(1).optional().default(1),
});
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export const DEFAULT_PAGINATION = {
  limit: 10,
  page: 1,
} as const satisfies PaginationQuery;
