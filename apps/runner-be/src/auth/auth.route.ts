import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { setCookie } from "hono/cookie";
import { HonoEnv } from "../index.js";
import { requestBodyJson } from "../utils/openapi.js";
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
    body: requestBodyJson(
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
  // const { email, password } = c.req.valid("json");

  // const user = await authenticateUser(email, password);

  // if (!user) {
  //   return c.json({ error: "Invalid email or password" }, 401);
  // }

  // const token = generateSessionToken();
  // const session = await createSession(token, user.id);

  // console.log(session);

  // setSessionCookie(c, token, session);

  setCookie(c, "fuck", "you");
  console.log(c.res.headers);

  return c.body("yup");
});
