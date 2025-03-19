/// <reference path="../.astro/types.d.ts" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    user: import("@runner/schemas/user").User | undefined;
  }
}

/**
 * Put environment variables here for intellisense
 */
interface ImportMetaEnv {
  readonly PUBLIC_API_URL: string;
  readonly PUBLIC_DASH_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
