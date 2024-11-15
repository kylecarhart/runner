import { OpenAPIHono } from "@hono/zod-openapi";
import { contextStorage } from "hono/context-storage";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { Logger } from "pino";
import { usersApp } from "./app/users/users.route.js";
import { Database } from "./database/db.js";
import { errorHandler } from "./handlers/error.handler.js";
import { dbMiddleware } from "./middleware/db.middleware.js";
import { loggerMiddleware } from "./middleware/logger.middleware.js";
import { Env } from "./utils/env.js";
import { bootstrapOpenApi } from "./utils/openapi.js";

// Hono env with CF bindings
export type HonoEnv = {
  Bindings: Env;
  Variables: {
    logger: Logger;
    db: Database;
  };
};

const app = new OpenAPIHono<HonoEnv>();
const v1 = new OpenAPIHono<HonoEnv>();

/** Middleware */
app.use(contextStorage()); // Context storage. See: https://hono.dev/docs/middleware/builtin/context-storage
app.use(secureHeaders()); // Security headers
app.use(cors()); // CORS

/** App Middleware */
app.use(loggerMiddleware()); // Logger
app.use(dbMiddleware()); // Database
bootstrapOpenApi(app);

/** Root Handlers */
app.onError(errorHandler()); // Error handling
app.get("/health", (c) => c.json({ status: "OK" })); // Health check

/** V1 Handlers */
v1.route("/users", usersApp);

/** Bootstrap */
app.route("/api/v1", v1); // V1 routes

/** Serve application */
export default app;
