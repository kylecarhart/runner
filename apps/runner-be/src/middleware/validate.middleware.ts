import Router from "@koa/router";
import { Context, Next } from "koa";
import compose from "koa-compose";
import { z, ZodError, ZodSchema } from "zod";
import { ResponseValidationError } from "../errors/ResponseValidationError";
import { enabled } from "../utils/flags";

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
  ({ req, res, query, params }: Schemas) =>
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

    if (params) {
      const parsedParams = await params.parseAsync(ctx.params);
      ctx.params = parsedParams;
    }

    await next(); // Wait for route to complete

    // Only run if response validation is enabled
    if (res && enabled("RESPONSE_VALIDATION")) {
      try {
        await res.parseAsync(ctx.body);
      } catch (e) {
        // Typescript should prevent throws here. If you threw, you fucked up.
        throw new ResponseValidationError(e as ZodError);
      }
    }
  };

type OptionalZodSchema = ZodSchema | undefined;
/**
 * We need to do `undefined extends T` because union types distribute
 * @see https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
 */
type OptionalInferredType<Schema extends OptionalZodSchema> =
  undefined extends Schema
    ? unknown
    : Schema extends ZodSchema
      ? z.infer<Schema>
      : never;

/**
 * Context with request body, response body, query params, and params inferred
 * from optionally provided zod schemas.
 *
 * TODO: Ideally, I would like to override the types that come default with
 * router and koa, but for now, I will just create my own `requestBody` alias
 * to `ctx.request.body`.
 */
type HandlerContext<
  RequestBodySchema extends OptionalZodSchema,
  ResponseBodySchema extends OptionalZodSchema,
  QueryParamsSchema extends OptionalZodSchema,
  ParamsSchema extends OptionalZodSchema,
> = Omit<Router.RouterContext, "requestBody" | "query" | "body" | "params"> & {
  requestBody: OptionalInferredType<RequestBodySchema>;
  query: OptionalInferredType<QueryParamsSchema>;
  body: OptionalInferredType<ResponseBodySchema>;
  params: OptionalInferredType<ParamsSchema>;
};

/**
 * Zod schemas to parse for request and response bodies.
 */
type Schemas<
  RequestBodySchema = OptionalZodSchema,
  ResponseBodySchema = ZodSchema,
  QueryParamsSchema = OptionalZodSchema,
  ParamsSchema = OptionalZodSchema,
> = {
  /** Request zod schema */
  req?: RequestBodySchema;
  /** Response zod schema */
  res: ResponseBodySchema;
  /** Query params zod schema */
  query?: QueryParamsSchema;
  /** Params zod schema */
  params?: ParamsSchema;
};

/**
 * Validates request bodies, response bodies, query params, and params using
 * the provided schemas. Note that only response is required.
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
  ResponseBodySchema extends ZodSchema,
  QueryParamsSchema extends OptionalZodSchema,
  ParamsSchema extends OptionalZodSchema,
>(
  {
    req,
    res,
    query,
    params,
  }: Schemas<
    RequestBodySchema,
    ResponseBodySchema,
    QueryParamsSchema,
    ParamsSchema
  >,
  handler: (
    ctx: HandlerContext<
      RequestBodySchema,
      ResponseBodySchema,
      QueryParamsSchema,
      ParamsSchema
    >,
    next: Next,
  ) => unknown,
) {
  return compose([validateMiddleware({ req, res, query, params }), handler]);
}
