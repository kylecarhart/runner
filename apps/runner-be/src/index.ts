/* eslint-disable @typescript-eslint/no-unused-vars */
import { OpenAPIHono } from "@hono/zod-openapi";
import { Context } from "hono";
import { contextStorage } from "hono/context-storage";
import { secureHeaders } from "hono/secure-headers";
import { usersApp } from "./app/users/users.route.js";
import { User } from "./app/users/users.schema.js";
import { authApp } from "./auth/auth.route.js";
import { Database } from "./database/db.js";
import { errorHandler } from "./handlers/error.handler.js";
import { corsMiddleware } from "./middleware/cors.middleware.js";
import { csrfMiddleware } from "./middleware/csrf.middleware.js";
import { dbMiddleware } from "./middleware/db.middleware.js";
import { loggerMiddleware } from "./middleware/logger.middleware.js";
import { sessionsMiddleware } from "./middleware/sessions.middleware.js";
import { Env, isDevelopment } from "./utils/env.js";
import { Logger } from "./utils/logger.js";
import { bootstrapOpenApi } from "./utils/openapi.js";

// Hono env with CF bindings
export type HonoEnv = {
  Bindings: Env;
  Variables: {
    logger: Logger;
    db: Database;
    user: User | undefined;
  };
};
export type HonoContext = Context<HonoEnv>; // Application specific context

const app = new OpenAPIHono<HonoEnv>();
const v1 = new OpenAPIHono<HonoEnv>();

/** Middleware */
app.use(contextStorage()); // Context storage. See: https://hono.dev/docs/middleware/builtin/context-storage
app.use(loggerMiddleware()); // Logger
app.use(dbMiddleware()); // Database
app.use(sessionsMiddleware()); // Sessions
app.use(secureHeaders()); // Security headers
app.use(csrfMiddleware()); // CSRF protection
app.use(corsMiddleware()); // CORS

/** Root Handlers */
app.onError(errorHandler()); // Error handling
app.get("/health", (c) => c.json({ status: "OK" })); // Health check

/** V1 Handlers */
const v1Routes = v1
  .route("/users", usersApp) // User routes
  .route("/auth", authApp); // Auth routes

/** Bootstrap */
const appRoutes = app.route("/api/v1", v1Routes); // V1 routes
if (isDevelopment()) {
  bootstrapOpenApi(app); // Bootstrap OpenAPI only in development
}

/** Serve application */
export default app;
export type AppType = typeof appRoutes;
