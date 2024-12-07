import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { CreateUserRequestSchema } from "@runner/api";
import { createUser } from "../app/users/users.service.js";
import { HonoEnv } from "../index.js";
import { contentJson } from "../utils/openapi.js";
import { data } from "../utils/response.js";
import { authenticateUser } from "./auth.service.js";
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
      const createUserRequest = c.req.valid("json");

      // Eventually we should send a confirmation email to the user
      const newUser = await createUser(createUserRequest);
      return data(c, 200, newUser);
    },
  );
