import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { usersApp } from "./app/users/users.route.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { loggerMiddleware } from "./middleware/logger.middleware.js";
import { Env } from "./utils/env.js";
import { logger } from "./utils/logger.js";

const app = new OpenAPIHono();
const v1 = new OpenAPIHono();

app.use(secureHeaders());
app.use(cors());

app.use(errorMiddleware());
app.use(loggerMiddleware());

app.get("/health", (c) => c.json({ status: "OK" }));
app.get("/error", (c) => {
  throw new Error("Test error");
});

// V1 Routes
v1.route("/users", usersApp);

// Bootstrap
app.route("/api/v1", v1);

app.doc(Env.PATH_OPENAPI, {
  openapi: "3.1.0",
  info: {
    version: "1.0.0",
    title: "Runner API",
  },
});

app.get(Env.PATH_SWAGGER, swaggerUI({ url: Env.PATH_OPENAPI }));
app.get(
  Env.PATH_SCALAR,
  apiReference({
    spec: {
      url: Env.PATH_OPENAPI,
    },
  }),
);

serve({ fetch: app.fetch, port: Env.PORT }, (info) => {
  logger.info(`Server started on port ${info.port}.`);
  logger.info(
    `Swagger docs available at: http://localhost:${info.port}${Env.PATH_SWAGGER}.`,
  );
  logger.info(
    `Scalar docs available at: http://localhost:${info.port}${Env.PATH_SCALAR}.`,
  );
});
