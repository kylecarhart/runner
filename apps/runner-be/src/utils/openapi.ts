import type {
  ResponseConfig,
  ZodRequestBody,
} from "@asteasolutions/zod-to-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { ZodSchema } from "zod";
import { Env } from "./env.js";

/**
 * Bootstraps OpenAPI documentation and UI endpoints for the application
 * @param app - The OpenAPIHono application instance
 */
export const bootstrapOpenApi = (app: OpenAPIHono) => {
  // OpenAPI documentation
  app.doc(Env.PATH_OPENAPI, {
    openapi: "3.1.0",
    info: {
      version: "1.0.0",
      title: "Runner API",
    },
  });

  // Swagger UI
  app.get(Env.PATH_SWAGGER, swaggerUI({ url: Env.PATH_OPENAPI }));

  // TODO: Evaluate scalar as an alternative to swagger UI
  app.get(
    Env.PATH_SCALAR,
    apiReference({
      spec: {
        url: Env.PATH_OPENAPI,
      },
    }),
  );
};

/**
 * Creates a JSON request body specification for OpenAPI
 * @param description - Description of the request body
 * @param schema - Zod schema defining the request body structure
 * @returns OpenAPI request body specification
 */
export function requestBodyJson<T extends ZodSchema>(
  description: string,
  schema: T,
) {
  return {
    description,
    content: {
      "application/json": {
        schema,
      },
    },
  } satisfies ZodRequestBody;
}

/**
 * Creates a JSON response body specification for OpenAPI
 * @param description - Description of the response body
 * @param schema - Zod schema defining the response body structure
 * @returns OpenAPI response body specification
 */
export function responseBodyJson<T extends ZodSchema>(
  description: string,
  schema: T,
) {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
  } satisfies ResponseConfig;
}
