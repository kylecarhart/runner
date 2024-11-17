import type { Env as BaseEnv } from "./src/utils/env.js";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Env extends BaseEnv {}

// Declare build-time constants for esbuild's define plugin
declare global {
  /** Environment */
  const NODE_ENV: Env["NODE_ENV"];
  /** OpenAPI documentation path */
  const PATH_OPENAPI: Env["PATH_OPENAPI"];
  /** Swagger UI path */
  const PATH_SWAGGER: Env["PATH_SWAGGER"];
  /** Scalar API reference path */
  const PATH_SCALAR: Env["PATH_SCALAR"];
}
