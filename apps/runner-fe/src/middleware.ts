import { defineMiddleware } from "astro:middleware";

// TODO: Maybe we can add the user to the astro context if they exist
export const onRequest = defineMiddleware((context, next) => {
  const session = context.cookies.get("session");
  if (session) {
  }
  return next();
});
