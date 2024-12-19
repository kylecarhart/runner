import type { AppType } from "@runner/runner-be";
import { hc } from "hono/client";

/** @see https://github.com/cloudflare/workers-sdk/issues/2514#issuecomment-2178070014 */
const isCredentialsSupported = "credentials" in Request.prototype;

/**
 * TODO: I want to be be able to pass any cookies along if SSR
 * @see https://github.com/withastro/roadmap/discussions/190#discussioncomment-8911086
 * @see https://www.npmjs.com/package/astro-global
 */
export const v1Client = hc<AppType>(import.meta.env.PUBLIC_API_URL, {
  init: {
    ...(isCredentialsSupported && { credentials: "include" }), // Include cookies in all requests client side requests
  },
}).api.v1;

/** Users */
export const getUser = v1Client.users[":id"].$get;
export const getUsers = v1Client.users.$get;
export const updateUser = v1Client.users[":id"].$patch;
export const getProfile = v1Client.users.profile.$get;

/** Auth */
export const signup = v1Client.auth.signup.$post;
export const login = v1Client.auth.login.$post;
export const confirmEmail = v1Client.auth["confirm-email"].$post;
