import { Context, Next } from "koa";
import compose from "koa-compose";
import { z, ZodSchema } from "zod";

/**
 * Validates request and response bodies. The middleware will throw errors if
 * the request or response bodies do not match the provided schemas.
 * @returns Koa middleware
 */
const validateMiddleware =
  (requestSchema: ZodSchema, responseSchema?: ZodSchema) =>
  async (ctx: Context, next: Next) => {
    const parsedBody = await requestSchema.parseAsync(ctx.request.body);
    ctx.request.body = parsedBody;

    await next(); // Wait for route to complete

    if (responseSchema) {
      await responseSchema.parseAsync(ctx.body);
    }
  };

type Middleware = (ctx: Context, next: Next) => unknown;

type Modify<T, U> = Omit<T, keyof U> & U;

/**
 * Context with request and response body inferred types.
 */
type HandlerContext<
  T extends ZodSchema,
  U extends ZodSchema | unknown,
> = Modify<
  Context,
  {
    request: Modify<Context["request"], { body: z.infer<T> }>;
    body: U extends ZodSchema ? z.infer<U> : unknown;
  }
>;

/**
 * Zod schemas to parse for request and response bodies.
 */
type Schemas<T extends ZodSchema, U extends ZodSchema | undefined> = {
  /** Request zod schema */
  req: T;
  /** Response zod schema */
  res?: U;
};

/**
 * Validates request and response bodies (optional).
 * @param param0 Request and response schemas
 * @param handler Route handler
 * @returns Koa middleware
 */
export function validate<T extends ZodSchema, U extends ZodSchema | undefined>(
  { req, res }: Schemas<T, U>,
  handler: (ctx: HandlerContext<T, U>, next: Next) => unknown,
) {
  return compose([validateMiddleware(req, res), handler as Middleware]);
}
