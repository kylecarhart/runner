import { Context, Next } from "koa";
import compose from "koa-compose";
import { z, ZodError, ZodSchema } from "zod";
import { ResponseValidationError } from "../errors/ResponseValidationError";

/**
 * Validates request and response bodies. The middleware will throw errors if
 * the request or response bodies do not match the provided schemas.
 *
 * TODO: Fix this if it becomes a bottleneck. Perhaps don't run in production.
 * Local testing shows it adds ~10ms to the request time.
 *
 * @returns Koa middleware
 */
const validateMiddleware =
  (reqSchema: ZodSchema, resSchema?: ZodSchema) =>
  async (ctx: Context, next: Next) => {
    const parsedBody = await reqSchema.parseAsync(ctx.request.body);
    ctx.request.body = parsedBody;

    await next(); // Wait for route to complete

    if (resSchema) {
      try {
        await resSchema.parseAsync(ctx.body);
      } catch (e) {
        // Typescript should prevent throws here. If you threw, you fucked up.
        throw new ResponseValidationError(e as ZodError);
      }
    }
  };

/** Koa middleware type */
// type Middleware = (ctx: Context, next: Next) => unknown;

/** Helper for modifying pre-existing types */
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
export function validate<T extends ZodSchema, U extends ZodSchema | undefined>(
  { req, res }: Schemas<T, U>,
  handler: (ctx: HandlerContext<T, U>, next: Next) => unknown,
) {
  return compose([validateMiddleware(req, res), handler]);
}
