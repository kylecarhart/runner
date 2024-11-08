import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { usersApp } from "./app/users/users.route.js";
import { errorHandler } from "./handlers/error.handler.js";
import { loggerMiddleware } from "./middleware/logger.middleware.js";
import { Env, isDevelopment } from "./utils/env.js";
import { logger } from "./utils/logger.js";
import { bootstrapOpenApi } from "./utils/openapi.js";

const app = new OpenAPIHono();
const v1 = new OpenAPIHono();

/** Middleware */
app.use(secureHeaders()); // Security headers
app.use(cors()); // CORS
app.use(loggerMiddleware()); // Logger

/** Root Handlers */
app.onError(errorHandler()); // Error handling
app.get("/health", (c) => c.json({ status: "OK" })); // Health check

/** V1 Handlers */
v1.route("/users", usersApp);

/** Bootstrap */
app.route("/api/v1", v1); // V1 routes

if (isDevelopment) {
  bootstrapOpenApi(app);
}

/** Serve application */
serve({ fetch: app.fetch, port: Env.PORT }, (info) => {
  logger.info(`Server started on port ${info.port}.`);

  if (isDevelopment) {
    logger.info(
      `Swagger docs available at: http://localhost:${info.port}${Env.PATH_SWAGGER}.`,
    );
    logger.info(
      `Scalar docs available at: http://localhost:${info.port}${Env.PATH_SCALAR}.`,
    );
  }
});
