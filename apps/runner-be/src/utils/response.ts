import { Pagination, SuccessResponseSchema } from "@runner/api/response";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { ZodSchema } from "zod";
import { ZodResponseError } from "../errors/ZodResponseError.js";
import { HonoContext } from "../index.js";
import { isDevelopment } from "./env.js";

// ! TODO: Maybe at some point move these to actually be on the context

/**
 * Returns, ZodSchema a success response with an optional message
 * @param c - Hono Context object
 * @param status - HTTP status code
 * @param message - Optional success message
 * @returns JSON response with success flag and optional message
 */
export function success<SC extends ContentfulStatusCode>(
  c: HonoContext,
  status: SC,
  message?: string,
) {
  const body = {
    success: true,
    ...(message && { message }),
  } as const;

  // Parse the body in development to ensure no leakage...
  if (isDevelopment()) {
    const result = SuccessResponseSchema.safeParse(body);
    if (!result.success) {
      throw new ZodResponseError(result.error.issues);
    }
  }

  return c.json(body, status);
}

/**
 * Returns a success response containing data and an optional message
 * @param c - Hono Context object
 * @param status - HTTP status code
 * @param data - Data to be included in the response
 * @param message - Optional success message
 * @returns JSON response with success flag, data, and optional message
 */
export function data<SC extends ContentfulStatusCode, D, ZS extends ZodSchema>(
  c: HonoContext,
  status: SC,
  data: D,
  schema: ZS,
  message?: string,
) {
  const body = {
    success: true,
    data,
    ...(message && { message }),
  } as const;

  // Parse the body in development to ensure no leakage...
  if (isDevelopment()) {
    const result = schema.safeParse(body);
    if (!result.success) {
      throw new ZodResponseError(result.error.issues);
    }
  }

  return c.json(body, status);
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
export function pagination<
  SC extends ContentfulStatusCode,
  ZS extends ZodSchema,
  D,
>(
  c: HonoContext,
  status: SC,
  data: D,
  schema: ZS,
  pagination: Pick<Pagination, "page" | "total" | "limit">,
  message?: string,
) {
  const body = {
    success: true,
    data,
    pagination: paginationHelper(pagination),
    ...(message && { message }),
  } as const;

  // Parse the body in development to ensure no leakage...
  if (isDevelopment()) {
    const result = schema.safeParse(body);
    if (!result.success) {
      throw new ZodResponseError(result.error.issues);
    }
  }

  return c.json(body, status);
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
