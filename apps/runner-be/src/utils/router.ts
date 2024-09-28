import Router from "@koa/router";
import { GetUserOpenApiPath } from "@runner/api";
import { z, ZodSchema } from "zod";
import { ZodOpenApiPathsObject } from "zod-openapi";

/** Http verbs */
type HttpVerbs =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head"
  | "trace";

/** Return only the zod openapi paths for the given http verb */
type ZodPathsForMethod<
  PathsObject extends ZodOpenApiPathsObject,
  Verb extends HttpVerbs,
> = {
  [Path in keyof PathsObject as Verb extends keyof PathsObject[Path]
    ? Path
    : never]: PathsObject[Path];
};

/** Convert a path from the openapi format to a Koa format */
type KoaPath<OpenApiPath extends string> =
  OpenApiPath extends `${infer Start}{${infer Param}}${infer Rest}`
    ? `${Start}:${Param}${KoaPath<Rest>}`
    : OpenApiPath;

/** Extract the path params schema for the given zod openapi path and method */
type ExtractPathParamsSchema<
  T extends ZodOpenApiPathsObject,
  Path extends keyof T,
  Method extends keyof T[Path],
> = Path extends Path // This distributes over the union
  ? T[Path][Method] extends { requestParams: { path: ZodSchema } }
    ? z.infer<T[Path][Method]["requestParams"]["path"]>
    : undefined
  : never;

/** Extract the response schemas for the given path and method */
type ExtractResponseSchemas<
  T extends ZodOpenApiPathsObject,
  Path extends keyof T,
  Method extends keyof T[Path],
> = Path extends Path
  ? T[Path][Method] extends { responses: infer R }
    ? {
        [StatusCode in keyof R]: R[StatusCode] extends {
          content: { "application/json": { schema: ZodSchema } };
        }
          ? {
              statusCode: StatusCode;
              body: z.infer<
                R[StatusCode]["content"]["application/json"]["schema"]
              >;
            }
          : {
              statusCode: StatusCode;
            };
      }[keyof R]
    : never
  : never;

class OpenApiRouter<PathsObject extends ZodOpenApiPathsObject> {
  private readonly router: Router;
  private readonly openApiPath: PathsObject;

  constructor(openApiPath: PathsObject, opt?: Router.RouterOptions) {
    this.openApiPath = openApiPath;
    this.router = new Router(opt);
  }

  // use(
  //   ...middleware: Router.Middleware<DefaultState, DefaultContext, unknown>[]
  // ): Router<DefaultState, DefaultContext>;
  // use(
  //   path: string | string[] | RegExp,
  //   ...middleware: Router.Middleware<DefaultState, DefaultContext, unknown>[]
  // ): Router<DefaultState, DefaultContext>;
  // use(
  //   path?: unknown,
  //   ...middleware: unknown[]
  // ): Router<import("koa").DefaultState, import("koa").DefaultContext> {
  //   throw new Error("Method not implemented.");
  // }
  // get<T = {}, U = {}, B = unknown>(
  //   name: string,
  //   path: string | RegExp,
  //   ...middleware: Router.Middleware<DefaultState & T, DefaultContext & U, B>[]
  // ): Router<DefaultState, DefaultContext>;
  // get<T = {}, U = {}, B = unknown>(
  //   path: string | RegExp | Array<string | RegExp>,
  //   ...middleware: Router.Middleware<DefaultState & T, DefaultContext & U, B>[]
  // ): Router<DefaultState, DefaultContext>;
  get<
    Path extends keyof ZodPathsForMethod<PathsObject, "get">,
    PathParams extends ExtractPathParamsSchema<PathsObject, Path, "get">,
    Responses extends ExtractResponseSchemas<PathsObject, Path, "get">,
  >(
    name: string,
    path: KoaPath<Path>,
    handler: ({ params }: { params: PathParams }) => Responses,
  ): Router {
    const paramsSchema =
      this.openApiPath[path]?.["get"]?.["requestParams"]?.["path"];

    return this.router.get(name, path as string, handler); // TODO: Maybe get rid of type assertion
  }
  // post<T = {}, U = {}, B = unknown>(
  //   name: string,
  //   path: string | RegExp,
  //   ...middleware: Router.Middleware<DefaultState & T, DefaultContext & U, B>[]
  // ): Router<DefaultState, DefaultContext>;
  // post<T = {}, U = {}, B = unknown>(
  //   path: string | RegExp | Array<string | RegExp>,
  //   ...middleware: Router.Middleware<DefaultState & T, DefaultContext & U, B>[]
  // ): Router<DefaultState, DefaultContext>;
  // post(
  //   name: unknown,
  //   path?: unknown,
  //   ...middleware: unknown[]
  // ): Router<import("koa").DefaultState, import("koa").DefaultContext> {
  //   throw new Error("Method not implemented.");
  // }
  // put<T = {}, U = {}, B = unknown>(
  //   name: string,
  //   path: string | RegExp,
  //   ...middleware: Router.Middleware<DefaultState & T, DefaultContext & U, B>[]
  // ): Router<DefaultState, DefaultContext>;
  // put<T = {}, U = {}, B = unknown>(
  //   path: string | RegExp | Array<string | RegExp>,
  //   ...middleware: Router.Middleware<DefaultState & T, DefaultContext & U, B>[]
  // ): Router<DefaultState, DefaultContext>;
  // put(
  //   name: unknown,
  //   path?: unknown,
  //   ...middleware: unknown[]
  // ): Router<import("koa").DefaultState, import("koa").DefaultContext> {
  //   throw new Error("Method not implemented.");
  // }
  // link<T = {}, U = {}, B = unknown>(
  //   name: string,
  //   path: string | RegExp,
  //   ...middleware: Router.Middleware<DefaultState & T, DefaultContext & U, B>[]
  // ): Router<DefaultState, DefaultContext>;
  // link<T = {}, U = {}, B = unknown>(
  //   path: string | RegExp | Array<string | RegExp>,
  //   ...middleware: Router.Middleware<DefaultState & T, DefaultContext & U, B>[]
  // ): Router<DefaultState, DefaultContext>;
  // link(
  //   name: unknown,
  //   path?: unknown,
  //   ...middleware: unknown[]
  // ): Router<import("koa").DefaultState, import("koa").DefaultContext> {
  //   throw new Error("Method not implemented.");
  // }
  // unlink<T = {}, U = {}, B = unknown>(
  //   name: string,
  //   path: string | RegExp,
  //   ...middleware: Router.Middleware<DefaultState & T, DefaultContext & U, B>[]
  // ): Router<DefaultState, DefaultContext>;
  // unlink<T = {}, U = {}, B = unknown>(
  //   path: string | RegExp | Array<string | RegExp>,
  //   ...middleware: Router.Middleware<DefaultState & T, DefaultContext & U, B>[]
  // ): Router<DefaultState, DefaultContext>;
  // unlink(
  //   name: unknown,
  //   path?: unknown,
  //   ...middleware: unknown[]
  // ): Router<import("koa").DefaultState, import("koa").DefaultContext> {
  //   throw new Error("Method not implemented.");
  // }
  // delete<T = {}, U = {}, B = unknown>(
  //   name: string,
  //   path: string | RegExp,
  //   ...middleware: Router.Middleware<DefaultState & T, DefaultContext & U, B>[]
  // ): Router<DefaultState, DefaultContext>;
  // delete<T = {}, U = {}, B = unknown>(
  //   path: string | RegExp | Array<string | RegExp>,
  //   ...middleware: Router.Middleware<DefaultState & T, DefaultContext & U, B>[]
  // ): Router<DefaultState, DefaultContext>;
  // delete(
  //   name: unknown,
  //   path?: unknown,
  //   ...middleware: unknown[]
  // ): Router<import("koa").DefaultState, import("koa").DefaultContext> {
  //   throw new Error("Method not implemented.");
  // }
  // del<T = {}, U = {}, B = unknown>(
  //   name: string,
  //   path: string | RegExp,
  //   ...middleware: Router.Middleware<DefaultState & T, DefaultContext & U, B>[]
  // ): Router<DefaultState, DefaultContext>;
  // del<T = {}, U = {}, B = unknown>(
  //   path: string | RegExp | Array<string | RegExp>,
  //   ...middleware: Router.Middleware<DefaultState & T, DefaultContext & U, B>[]
  // ): Router<DefaultState, DefaultContext>;
  // del(
  //   name: unknown,
  //   path?: unknown,
  //   ...middleware: unknown[]
  // ): Router<import("koa").DefaultState, import("koa").DefaultContext> {
  //   throw new Error("Method not implemented.");
  // }
  // head<T = {}, U = {}, B = unknown>(
  //   name: string,
  //   path: string | RegExp,
  //   ...middleware: Router.Middleware<DefaultState & T, DefaultContext & U, B>[]
  // ): Router<DefaultState, DefaultContext>;
  // head<T = {}, U = {}, B = unknown>(
  //   path: string | RegExp | Array<string | RegExp>,
  //   ...middleware: Router.Middleware<DefaultState & T, DefaultContext & U, B>[]
  // ): Router<DefaultState, DefaultContext>;
  // head(
  //   name: unknown,
  //   path?: unknown,
  //   ...middleware: unknown[]
  // ): Router<import("koa").DefaultState, import("koa").DefaultContext> {
  //   throw new Error("Method not implemented.");
  // }
  // options<T = {}, U = {}, B = unknown>(
  //   name: string,
  //   path: string | RegExp,
  //   ...middleware: Router.Middleware<DefaultState & T, DefaultContext & U, B>[]
  // ): Router<DefaultState, DefaultContext>;
  // options<T = {}, U = {}, B = unknown>(
  //   path: string | RegExp | Array<string | RegExp>,
  //   ...middleware: Router.Middleware<DefaultState & T, DefaultContext & U, B>[]
  // ): Router<DefaultState, DefaultContext>;
  // options(
  //   name: unknown,
  //   path?: unknown,
  //   ...middleware: unknown[]
  // ): Router<import("koa").DefaultState, import("koa").DefaultContext> {
  //   throw new Error("Method not implemented.");
  // }
  // patch<T = {}, U = {}, B = unknown>(
  //   name: string,
  //   path: string | RegExp,
  //   ...middleware: Router.Middleware<DefaultState & T, DefaultContext & U, B>[]
  // ): Router<DefaultState, DefaultContext>;
  // patch<T = {}, U = {}, B = unknown>(
  //   path: string | RegExp | Array<string | RegExp>,
  //   ...middleware: Router.Middleware<DefaultState & T, DefaultContext & U, B>[]
  // ): Router<DefaultState, DefaultContext>;
  // patch(
  //   name: unknown,
  //   path?: unknown,
  //   ...middleware: unknown[]
  // ): Router<import("koa").DefaultState, import("koa").DefaultContext> {
  //   throw new Error("Method not implemented.");
  // }
  // all<T = {}, U = {}, B = unknown>(
  //   name: string,
  //   path: string | RegExp,
  //   ...middleware: Router.Middleware<DefaultState & T, DefaultContext & U, B>[]
  // ): Router<DefaultState, DefaultContext>;
  // all<T = {}, U = {}, B = unknown>(
  //   path: string | RegExp | Array<string | RegExp>,
  //   ...middleware: Router.Middleware<DefaultState & T, DefaultContext & U, B>[]
  // ): Router<DefaultState, DefaultContext>;
  // all(
  //   name: unknown,
  //   path?: unknown,
  //   ...middleware: unknown[]
  // ): Router<import("koa").DefaultState, import("koa").DefaultContext> {
  //   throw new Error("Method not implemented.");
  // }
  // prefix(prefix: string): Router<DefaultState, DefaultContext> {
  //   throw new Error("Method not implemented.");
  // }
  // routes(): Router.Middleware<DefaultState, DefaultContext> {
  //   throw new Error("Method not implemented.");
  // }
  // middleware(): Router.Middleware<DefaultState, DefaultContext> {
  //   throw new Error("Method not implemented.");
  // }
  // allowedMethods(
  //   options?: Router.RouterAllowedMethodsOptions,
  // ): Router.Middleware<DefaultState, DefaultContext> {
  //   throw new Error("Method not implemented.");
  // }
  // redirect(
  //   source: string,
  //   destination: string,
  //   code?: number,
  // ): Router<DefaultState, DefaultContext> {
  //   throw new Error("Method not implemented.");
  // }
  // register(
  //   path: string | RegExp,
  //   methods: string[],
  //   middleware:
  //     | Router.Middleware<DefaultState, DefaultContext, unknown>
  //     | Router.Middleware<DefaultState, DefaultContext, unknown>[],
  //   opts?: Router.LayerOptions,
  // ): Router.Layer {
  //   throw new Error("Method not implemented.");
  // }
  // route(name: string): Router.Layer | boolean {
  //   throw new Error("Method not implemented.");
  // }
  // url(
  //   name: string,
  //   params?: any,
  //   options?: Router.UrlOptionsQuery,
  // ): Error | string {
  //   throw new Error("Method not implemented.");
  // }
  // match(path: string, method: string): Router.RoutesMatch {
  //   throw new Error("Method not implemented.");
  // }
  // param<BodyT = unknown>(
  //   param: string,
  //   middleware: Router.ParamMiddleware<DefaultState, DefaultContext, BodyT>,
  // ): Router<DefaultState, DefaultContext> {
  //   throw new Error("Method not implemented.");
  // }
}

const router = new OpenApiRouter(GetUserOpenApiPath);

router.get("getUser", "/users", ({ params }) => {
  return {
    statusCode: "200",
    body: {
      success: true,
      data: [],
    },
  };
});
