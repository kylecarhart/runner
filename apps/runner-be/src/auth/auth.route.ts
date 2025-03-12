import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { ConfirmEmailRequestSchema } from "@runner/api/email-confirmation";
import {
  CreateUserRequestSchema,
  CreateUserResponseSchema,
  LoginRequestSchema,
} from "@runner/api/user";
import { HonoEnv } from "../index.js";
import { contentJson } from "../utils/openapi.js";
import { data } from "../utils/response.js";
import { authenticateUser } from "./auth.service.js";
import {
  confirmEmail,
  initUserSignup,
} from "./email-confirmations/email-confirmations.service.js";
import {
  createSession,
  deleteSessionCookie,
  generateSessionToken,
  getSessionCookie,
  invalidateSession,
  setSessionCookie,
} from "./sessions.service.js";

const OPENAPI_TAG_AUTH = "Auth";

export const authApp = new OpenAPIHono<HonoEnv>()
  /**
   * Sign in
   */
  .openapi(
    createRoute({
      method: "post",
      path: "/login",
      summary: "Login",
      tags: [OPENAPI_TAG_AUTH],
      operationId: "login",
      request: {
        body: contentJson("Login", LoginRequestSchema),
      },
      responses: {
        200: {
          description: "User logged in successfully",
        },
        401: {
          description: "Unauthorized",
        },
      },
    }),
    async (c) => {
      // TODO: Should we do anything if someone is already logged in?

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

      return c.body("OK");
    },
  )
  /**
   * Sign up
   */
  .openapi(
    createRoute({
      method: "post",
      path: "/signup",
      summary: "Sign up a new user",
      tags: [OPENAPI_TAG_AUTH],
      operationId: "signup",
      request: {
        body: contentJson("The user to sign up", CreateUserRequestSchema),
      },
      responses: {
        201: contentJson("Signed up successfully", CreateUserResponseSchema),
      },
    }),
    async (c) => {
      // TODO: Rate limit
      const createUserRequest = c.req.valid("json");

      // Create email confirmation entry
      const user = await initUserSignup(createUserRequest);

      return data(c, 201, user, CreateUserResponseSchema);
    },
  )
  /**
   * Confirm email
   */
  .openapi(
    createRoute({
      method: "post",
      path: "/confirm-email",
      summary: "Confirm an email",
      tags: [OPENAPI_TAG_AUTH],
      operationId: "confirmEmail",
      request: {
        body: contentJson(
          "The email and code to confirm",
          ConfirmEmailRequestSchema,
        ),
      },
      responses: {
        200: {
          description: "Email confirmed.",
        },
      },
    }),
    async (c) => {
      // TODO: Rate limit
      const { email, code } = c.req.valid("json");

      // Confirm email
      const isEmailConfirmed = await confirmEmail(email, code);
      if (!isEmailConfirmed) {
        return c.json({ error: "Invalid email or code" }, 400);
      }

      c.status(200);
      return c.body("OK");
    },
  )
  /**
   * Logout
   */
  .openapi(
    createRoute({
      method: "post",
      path: "/logout",
      summary: "Logout",
      tags: [OPENAPI_TAG_AUTH],
      operationId: "logout",
      responses: {
        200: {
          description: "User logged out successfully",
        },
      },
    }),
    async (c) => {
      const session = getSessionCookie(c);
      if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      await invalidateSession(session);
      deleteSessionCookie(c);

      return c.body("OK");
    },
  );
