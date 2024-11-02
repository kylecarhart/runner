import { z } from "zod";

// TODO: Read https://dev.to/pragativerma18/unlocking-the-power-of-api-pagination-best-practices-and-strategies-4b49
export const PaginationQuerySchema = z.object({
  limit: z.coerce.number().max(100).optional().default(10),
  page: z.coerce.number().min(1).optional().default(1),
  sortBy: z.string().optional().default("id"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

/**
 * Sane defaults for pagination
 */
export const DEFAULT_PAGINATION: PaginationQuery = {
  limit: 10,
  page: 1,
  sortBy: "id",
  sortOrder: "desc",
} as const;
