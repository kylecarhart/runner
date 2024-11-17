import { cors } from "hono/cors";
import { isDevelopment } from "../utils/env.js";

const origins = ["http://localhost:8787", "https://example.com"];

/**
 * Cross Origin Resource Sharing (CORS) middleware.
 * @returns Hono CORS middleware
 */
export const corsMiddleware = () =>
  cors({
    origin: isDevelopment() ? "*" : origins, // Does not send "Access-Control-Allow-Origin" if theres no match.
    maxAge: 3600, // 1 hour cache for browsers to not send preflight requests
    credentials: true, // Allow cookies to be sent with requests
  });
