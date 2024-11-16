import { Pagination } from "@runner/api";
import { StatusCode } from "hono/utils/http-status";
import { HonoContext } from "../index.js";

// TODO: These helpers need more time in the oven

/**
 * Returns a success response with an optional message
 * @param c - Hono Context object
 * @param status - HTTP status code
 * @param message - Optional success message
 * @returns JSON response with success flag and optional message
 */
export function success<U extends StatusCode>(
  c: HonoContext,
  status: U,
  message?: string,
) {
  return c.json(
    {
      success: true,
      ...(message && { message }),
    } as const,
    status,
  );
}

/**
 * Returns a success response containing data and an optional message
 * @param c - Hono Context object
 * @param status - HTTP status code
 * @param data - Data to be included in the response
 * @param message - Optional success message
 * @returns JSON response with success flag, data, and optional message
 */
export function data<T, U extends StatusCode>(
  c: HonoContext,
  status: U,
  data: T,
  message?: string,
) {
  return c.json(
    {
      success: true,
      data,
      ...(message && { message }),
    } as const,
    status,
  );
}

/**
 * Returns a paginated response containing data, pagination metadata, and an optional message
 * @param c - Hono Context object
 * @param status - HTTP status code
 * @param data - Data to be included in the response
 * @param pagination - Pagination object containing page, total, and limit
 * @param message - Optional success message
 * @returns JSON response with success flag, data, pagination info, and optional message
 */
export function pagination<T, U extends StatusCode>(
  c: HonoContext,
  status: U,
  data: T,
  pagination: Pick<Pagination, "page" | "total" | "limit">,
  message?: string,
) {
  return c.json(
    {
      success: true,
      data,
      pagination: paginationHelper(pagination),
      ...(message && { message }),
    } as const,
    status,
  );
}

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
