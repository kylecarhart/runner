import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { Env } from "./env.js";

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
