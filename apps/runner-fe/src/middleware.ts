import { defineMiddleware } from "astro:middleware";
import { getProfile } from "./clients/v1Client.ts";

/**
 * Middleware to get the user from the session and add them to the context if
 * they exist.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  // Get session from cookies
  const sessionToken = context.cookies.get("session")?.value;
  if (!sessionToken) {
    context.locals.user = undefined;
    return next();
  }

  // Get the user from the session
  const res = await getProfile(
    {},
    {
      init: {
        headers: {
          cookie: `session=${sessionToken}`,
        },
      },
    },
  );

  // If the user exists, add them to the context
  if (res.ok) {
    const user = (await res.json()).data;
    context.locals.user = user;
  }

  return next();
});
