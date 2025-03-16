import type { Env as BaseEnv } from "./src/utils/env.js";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Env extends BaseEnv {}

// Declare build-time constants for esbuild's define plugin
declare global {
  /** Environment */
  const ENVIRONMENT: Env["ENVIRONMENT"];
}
