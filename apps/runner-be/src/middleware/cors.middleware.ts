import { cors } from "hono/cors";
import { isDevelopment } from "../utils/env.js";

const origins = ["http://localhost:8787", "https://example.com"];

/**
 * CORS middleware
 * @returns Hono middleware
 */
export const corsMiddleware = () =>
  cors({
    origin: isDevelopment() ? "*" : origins,
    maxAge: 3600, // 1 hour cache for browsers to not send preflight requests
    credentials: true, // Allow cookies to be sent with requests
  });
