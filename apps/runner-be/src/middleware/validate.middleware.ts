import Router from "@koa/router";
import { Context, DefaultContext, DefaultState, Next } from "koa";
import compose from "koa-compose";
import { ParsedUrlQuery } from "querystring";
import { z, ZodError, ZodSchema } from "zod";
import { ResponseValidationError } from "../errors/ResponseValidationError";

/**
 * Validates request bodies, query params, and response bodies. The middleware
 * will throw errors if the request or response bodies do not match the provided
 * schemas.
 *
 * TODO: Fix this if it becomes a bottleneck. Perhaps don't run in production.
 * Local testing shows it adds ~10ms to the request time.
 *
 * @returns Koa middleware
 */
const validateMiddleware =
  ({ req, res, query }: Schemas) =>
  async (ctx: Context, next: Next) => {
    if (req) {
      const parsedBody = await req.parseAsync(ctx.request.body);
      ctx.request.body = parsedBody; // Overwrite request body
      ctx.requestBody = parsedBody; // Create alias for request body with inferred type
    }

    // TODO: See if we want to throw on query params or not.
    if (query) {
      const parsedQuery = await query.parseAsync(ctx.query);
      ctx.query = parsedQuery;
    }

    await next(); // Wait for route to complete

    if (res) {
      try {
        await res.parseAsync(ctx.body);
      } catch (e) {
        // Typescript should prevent throws here. If you threw, you fucked up.
        throw new ResponseValidationError(e as ZodError);
      }
    }
  };

/** Helper for modifying pre-existing types */
// type Modify<T, U> = Omit<T, keyof U> & U;
type OptionalZodSchema = ZodSchema | undefined;

/**
 * Context with request and response body inferred types.
 * TODO: Ideally, I would like to override the types that come default with
 * router and koa, but for now, I will just create my own `requestBody` alias
 * to `ctx.request.body`.
 */
type HandlerContext<
  RequestBodySchema extends OptionalZodSchema,
  ResponseBodySchema extends OptionalZodSchema,
  QueryParamsSchema extends OptionalZodSchema,
> = Omit<
  Router.RouterContext<
    DefaultState,
    DefaultContext,
    ResponseBodySchema extends ZodSchema ? z.infer<ResponseBodySchema> : unknown
  >,
  "query"
> & {
  /**
   * We need to do `undefined extends T` because union types distribute
   * @see https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
   */
  requestBody: undefined extends RequestBodySchema
    ? unknown
    : RequestBodySchema extends ZodSchema
      ? z.infer<RequestBodySchema>
      : never;
} & {
  query: undefined extends QueryParamsSchema
    ? ParsedUrlQuery
    : QueryParamsSchema extends ZodSchema
      ? z.infer<QueryParamsSchema>
      : never;
};

/**
 * Zod schemas to parse for request and response bodies.
 */
type Schemas<
  RequestBodySchema = OptionalZodSchema,
  ResponseBodySchema = OptionalZodSchema,
  QueryParamsSchema = OptionalZodSchema,
> = {
  /** Request zod schema */
  req?: RequestBodySchema;
  /** Response zod schema */
  res?: ResponseBodySchema;
  /** Query params zod schema */
  query?: QueryParamsSchema;
};

/**
 * Validates request and response bodies (optional).
 *
 * @example
 * userRouter.post(
 *  "/",
 *  validate(
 *    { req: createUserRequestSchema, res: selectUserSchema.array() },
 *    async (ctx) => {
 *      const createUserRequest = ctx.request.body; // inferred type
 *      // ...
 *      ctx.body = newUser; // inferred type
 *    },
 *  ),
 *);
 *
 * @param param0 Request and response schemas
 * @param handler Route handler
 * @returns Koa middleware
 */
export function validate<
  RequestBodySchema extends OptionalZodSchema,
  ResponseBodySchema extends OptionalZodSchema,
  QueryParamsSchema extends OptionalZodSchema,
>(
  {
    req,
    res,
    query,
  }: Schemas<RequestBodySchema, ResponseBodySchema, QueryParamsSchema>,
  handler: (
    ctx: HandlerContext<
      RequestBodySchema,
      ResponseBodySchema,
      QueryParamsSchema
    >,
    next: Next,
  ) => unknown,
) {
  return compose([validateMiddleware({ req, res, query }), handler]);
}
