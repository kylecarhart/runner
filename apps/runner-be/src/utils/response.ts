import { Pagination } from "@runner/api";

// TODO: These helpers need more time in the oven

// type JSONRespondReturn = Context["json"]

/**
 * Creates a successful response with the provided data.
 * @param c - Hono Context object
 * @param data - Data to be included in the response
 * @returns JSON response with success status and data
 */
// export function successResponse<T>(
//   c: Context,
//   data?: T,
// ): T extends undefined ? { success: true } : { success: true; data: T } {
//   return c.json(
//     {
//       success: true,
//       data,
//     },
//     200,
//   );
// }

/**
 * Calculates pagination metadata including next and previous page numbers.
 * @param pagination - Object containing page, total, and limit properties
 * @returns Enhanced pagination object with nextPage and prevPage
 */
export function paginationHelper(
  pagination: Pick<Pagination, "page" | "total" | "limit">,
) {
  return {
    ...pagination,
    nextPage:
      pagination.page + 1 > (pagination.total ?? 0)
        ? null
        : pagination.page + 1,
    prevPage: pagination.page === 1 ? null : pagination.page - 1,
  };
}

/**
 * Creates a paginated response with the provided data and pagination metadata.
 * @param c - Hono Context object
 * @param data - Data to be included in the response
 * @param pagination - Pagination metadata
 * @returns JSON response with success status, data, and pagination info
 */
// export function paginationResponse<T>(
//   c: Context,
//   data: T,
//   pagination: Pagination,
// ) {
//   return c.json(
//     {
//       success: true,
//       data,
//       pagination,
//     },
//     200,
//   );
// }

/**
 * Creates an error response object.
 * @param data - Error data to be included in the response
 * @returns Object with success status and error data
 */
// export function ErrorResponse<T>(data: T) {
//   return {
//     success: true,
//     data,
//   };
// }
