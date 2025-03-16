import type {
  ResponseConfig,
  ZodRequestBody,
} from "@asteasolutions/zod-to-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { ZodSchema } from "zod";
import { HonoEnv } from "../index.js";

const PATH_SWAGGER = "/docs/swagger";
const PATH_SCALAR = "/docs/scalar";
const PATH_OPENAPI = "/docs/openapi.json";

/**
 * Bootstraps OpenAPI documentation and UI endpoints for the application
 * @param app - The OpenAPIHono application instance
 */
export const bootstrapOpenApi = (app: OpenAPIHono<HonoEnv>) => {
  // OpenAPI documentation
  app.doc(PATH_OPENAPI, {
    openapi: "3.1.0",
    info: {
      version: "1.0.0",
      title: "Runner API",
      description: "Backend API for the Runner application",
    },
    security: [
      {
        cookieAuth: [], // Apply cookie auth to all routes
      },
    ],
  });

  /**
   * Register cookie auth security scheme
   * *NOTE: Cookie values cannot be modified in swagger ui.
   * @see https://stackoverflow.com/questions/49272171/sending-cookie-session-id-with-swagger-3-0#answer-49273653
   */
  app.openAPIRegistry.registerComponent("securitySchemes", "cookieAuth", {
    type: "apiKey",
    in: "cookie",
    name: "session",
  });

  // Swagger UI
  app.get(PATH_SWAGGER, swaggerUI({ url: PATH_OPENAPI }));

  // TODO: Evaluate scalar as an alternative to swagger UI
  app.get(
    PATH_SCALAR,
    apiReference({
      url: PATH_OPENAPI,
    }),
  );
};

/**
 * Creates a JSON content body specification for OpenAPI
 * @param description - Description of the content body
 * @param schema - Zod schema defining the content body structure
 * @returns OpenAPI content body specification
 */
export function contentJson<T extends ZodSchema>(
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
  } as const satisfies ZodRequestBody & ResponseConfig;
}
