import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { HonoEnv } from "../index.js";
import { contentJson } from "../utils/openapi.js";
import { authenticateUser } from "./auth.service.js";
import {
  createSession,
  generateSessionToken,
  setSessionCookie,
} from "./sessions.service.js";
const OPENAPI_TAG_AUTH = "Auth";

export const authApp = new OpenAPIHono<HonoEnv>();

/**
 * Query users
 */
const signIn = createRoute({
  method: "post",
  path: "/sign-in",
  summary: "",
  tags: [OPENAPI_TAG_AUTH],
  request: {
    body: contentJson(
      "Sign in",
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    ),
  },
  responses: {
    200: {
      description: "Sign in",
      content: {
        "application/json": {
          schema: z.object({
            email: z.string().email(),
            password: z.string(),
          }),
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
  },
});

authApp.openapi(signIn, async (c) => {
  if (c.var.user) {
    return c.json({ error: "Already signed in" }, 400);
  }

  const { email, password } = c.req.valid("json");

  // Check that user exists and password is correct
  const user = await authenticateUser(email, password);
  if (!user) {
    return c.json({ error: "Invalid email or password" }, 401);
  }

  // Create session
  const token = generateSessionToken();
  const session = await createSession(token, user.id);

  // Set session cookie
  setSessionCookie(c, token, session);

  return c.body("yup");
});
