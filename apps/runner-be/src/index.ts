import { OpenAPIHono } from "@hono/zod-openapi";
import { Context } from "hono";
import { contextStorage } from "hono/context-storage";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { secureHeaders } from "hono/secure-headers";
import { Logger } from "pino";
import { usersApp } from "./app/users/users.route.js";
import { User } from "./app/users/users.schema.js";
import { authApp } from "./auth/auth.route.js";
import { Database } from "./database/db.js";
import { errorHandler } from "./handlers/error.handler.js";
import { dbMiddleware } from "./middleware/db.middleware.js";
import { loggerMiddleware } from "./middleware/logger.middleware.js";
import { sessionsMiddleware } from "./middleware/sessions.middleware.js";
import { Env } from "./utils/env.js";
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
app.use(secureHeaders()); // Security headers
app.use(csrf()); // CSRF protection
app.use(
  cors({
    origin: "*",
    maxAge: 3600, // 1 hour cache for browsers to not send preflight requests
  }),
); // CORS

/** App Middleware */
app.use(loggerMiddleware()); // Logger
app.use(dbMiddleware()); // Database
app.use(sessionsMiddleware()); // Sessions

/** Root Handlers */
app.onError(errorHandler()); // Error handling
app.get("/health", (c) => c.json({ status: "OK" })); // Health check

/** V1 Handlers */
v1.route("/users", usersApp);
v1.route("/auth", authApp);

/** Bootstrap */
app.route("/api/v1", v1); // V1 routes
bootstrapOpenApi(app);

/** Serve application */
export default app;
