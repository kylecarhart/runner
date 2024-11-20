import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  ChangePasswordParamsSchema,
  ChangePasswordRequestSchema,
  ChangePasswordResponseSchema,
  CreateUserRequestSchema,
  CreateUserResponseSchema,
  DeleteUserParamsSchema,
  DeleteUserResponseSchema,
  GetUserParamsSchema,
  GetUserResponseSchema,
  GetUsersResponseSchema,
  PaginationQuerySchema,
  UpdateUserParamsSchema,
  UpdateUserRequestSchema,
} from "@runner/api";
import { HonoEnv } from "../../index.js";
import { contentJson } from "../../utils/openapi.js";
import { data, pagination, success } from "../../utils/response.js";
import {
  changePassword,
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "./users.service.js";

export const usersApp = new OpenAPIHono<HonoEnv>();
const OPENAPI_TAG_USERS = "Users";

/**
 * Create a new user
 */
const createUserRoute = createRoute({
  method: "post",
  path: "/",
  summary: "Create a new user",
  tags: [OPENAPI_TAG_USERS],
  request: {
    body: contentJson("The user to create", CreateUserRequestSchema),
  },
  responses: {
    200: contentJson("Create a new user", CreateUserResponseSchema),
  },
});

// TODO: We may need to chain these for RPC: https://hono.dev/docs/guides/best-practices
usersApp.openapi(createUserRoute, async (c) => {
  const createUserRequest = c.req.valid("json");
  const newUser = await createUser(createUserRequest);
  return data(c, 200, newUser);
});

/**
 * Query users
 */
const getUsers = createRoute({
  method: "get",
  path: "/",
  summary: "Get a paginated list of all users",
  tags: [OPENAPI_TAG_USERS],
  request: {
    query: PaginationQuerySchema,
  },
  responses: {
    200: contentJson("Get all users", GetUsersResponseSchema),
  },
});

usersApp.openapi(getUsers, async (c) => {
  const params = c.req.valid("query");
  const { data: users, pagination: paginationData } = await getAllUsers(params);
  return pagination(c, 200, users, paginationData);
});

/**
 * Get a user by ID
 */
const getUserRoute = createRoute({
  method: "get",
  path: "/{id}",
  summary: "Get a specific user by their ID",
  tags: [OPENAPI_TAG_USERS],
  request: {
    params: GetUserParamsSchema,
  },
  responses: {
    200: contentJson("Retrieve the user", GetUserResponseSchema),
  },
});

usersApp.openapi(getUserRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = await getUserById(id);
  return data(c, 200, user);
});

/**
 * Update a user
 */
const updateUserRoute = createRoute({
  method: "patch",
  path: "/{id}",
  summary: "Update a user's information",
  tags: [OPENAPI_TAG_USERS],
  request: {
    params: UpdateUserParamsSchema,
    body: contentJson("Update user information", UpdateUserRequestSchema),
  },
  responses: {
    200: contentJson("Update user information", GetUserResponseSchema),
  },
});

usersApp.openapi(updateUserRoute, async (c) => {
  const { id } = c.req.valid("param");
  const updateUserRequest = c.req.valid("json");
  const updatedUser = await updateUser(id, updateUserRequest);
  return data(c, 200, updatedUser);
});

/**
 * Delete a user
 */
const deleteUserRoute = createRoute({
  method: "delete",
  path: "/{id}",
  summary: "Delete a user by their ID",
  tags: [OPENAPI_TAG_USERS],
  request: {
    params: DeleteUserParamsSchema,
  },
  responses: {
    200: contentJson("Delete a user", DeleteUserResponseSchema),
  },
});

usersApp.openapi(deleteUserRoute, async (c) => {
  const { id } = c.req.valid("param");
  await deleteUser(id);
  return success(c, 200, "User deleted successfully");
});

/**
 * Change a user's password
 */
const changePasswordRoute = createRoute({
  method: "patch",
  path: "/{id}/password",
  summary: "Change a user's password",
  tags: [OPENAPI_TAG_USERS],
  request: {
    params: ChangePasswordParamsSchema,
    body: contentJson("Change user password", ChangePasswordRequestSchema),
  },
  responses: {
    200: contentJson("Change user password", ChangePasswordResponseSchema),
  },
});

usersApp.openapi(changePasswordRoute, async (c) => {
  const { id } = c.req.valid("param");
  const changePasswordRequest = c.req.valid("json");
  await changePassword(id, changePasswordRequest);
  return success(c, 200, "Password changed successfully");
});
