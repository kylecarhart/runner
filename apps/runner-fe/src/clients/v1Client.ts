import type { AppType } from "@runner/runner-be";
import { hc } from "hono/client";

export const v1Client = hc<AppType>(import.meta.env.PUBLIC_API_URL).api.v1;

/** Users */
export const getUser = v1Client.users[":id"].$get;
export const getUsers = v1Client.users.$get;
export const updateUser = v1Client.users[":id"].$patch;

/** Auth */
export const signup = v1Client.auth["sign-up"].$post;
export const confirmEmail = v1Client.auth["confirm-email"].$post;

// export function getUser(id: string) {
//   return v1Client.users[":id"].$get({ param: { id } });
// }

// export function getUsers(
//   query: Parameters<typeof v1Client.users.$get>[0]["query"],
// ) {
//   return v1Client.users.$get({ query });
// }

// export function updateUser(
//   id: string,
//   body: Parameters<(typeof v1Client.users)[":id"]["$patch"]>[0]["json"],
// ) {
//   return v1Client.users[":id"].$patch({ param: { id }, json: body });
// }
