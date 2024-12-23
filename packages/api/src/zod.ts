import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

/**
 * We need to extend zod with openapi in this separate file and use this in
 * each file that uses zod due to the way Astro handles tree shaking.
 *
 * @see https://github.com/asteasolutions/zod-to-openapi/issues/234
 * @see https://github.com/asteasolutions/zod-to-openapi/issues/265
 */
extendZodWithOpenApi(z);

export * from "zod";
