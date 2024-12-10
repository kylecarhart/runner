import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import {
  CreateUserRequestSchema,
  EmailConfirmationRequestSchema,
} from "@runner/api";
import { HonoEnv } from "../index.js";
import { contentJson } from "../utils/openapi.js";
import { authenticateUser } from "./auth.service.js";
import {
  confirmEmail,
  initUserSignup,
} from "./email-confirmations/email-confirmations.service.js";
import {
  createSession,
  generateSessionToken,
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
    }),
    async (c) => {
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
    },
  )
  /**
   * Sign up
   */
  .openapi(
    createRoute({
      method: "post",
      path: "/sign-up",
      summary: "Create a new user",
      tags: [OPENAPI_TAG_AUTH],
      operationId: "createUser",
      request: {
        body: contentJson("The user to create", CreateUserRequestSchema),
      },
      responses: {
        200: {
          description: "Create a new user",
        },
      },
    }),
    async (c) => {
      // TODO: Rate limit
      const createUserRequest = c.req.valid("json");

      // Create email confirmation entry
      await initUserSignup(createUserRequest);

      c.status(200);
      return c.body("OK");
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
          EmailConfirmationRequestSchema,
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
  );
