import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  ChangePasswordParamsSchema,
  ChangePasswordRequestSchema,
  CreateUserRequestSchema,
  DeleteUserParamsSchema,
  GetUserParamsSchema,
  GetUserResponseSchema,
  GetUsersRequestQueryParamsSchema,
  GetUsersResponseSchema,
  UpdateUserParamsSchema,
  UpdateUserRequestSchema,
} from "@runner/api";
import { usersService } from "./users.service.js";

export const usersApp = new OpenAPIHono();
const OPENAPI_TAG_USERS = "Users";

/**
 * Create a new user
 */
const createUserRoute = createRoute({
  method: "post",
  path: "/",
  tags: [OPENAPI_TAG_USERS],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateUserRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: GetUserResponseSchema,
        },
      },
      description: "Create a new user",
    },
  },
});

usersApp.openapi(createUserRoute, async (c) => {
  const createUserRequest = c.req.valid("json");
  const newUser = await usersService.createUser(createUserRequest);
  return c.json(newUser, 200);
});

/**
 * Query users
 */
const queryUsersRoute = createRoute({
  method: "get",
  path: "/",
  tags: [OPENAPI_TAG_USERS],
  request: {
    query: GetUsersRequestQueryParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: GetUsersResponseSchema,
        },
      },
      description: "Query users",
    },
  },
});

usersApp.openapi(queryUsersRoute, async (c) => {
  const params = c.req.valid("query");
  const users = await usersService.queryUsers(params);
  return c.json(users, 200);
});

/**
 * Get a user by ID
 */
const getUserRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: [OPENAPI_TAG_USERS],
  request: {
    params: GetUserParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: GetUserResponseSchema,
        },
      },
      description: "Retrieve the user",
    },
  },
});

usersApp.openapi(getUserRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = await usersService.getUserById(id);
  return c.json(user, 200);
});

/**
 * Update a user
 */
const updateUserRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: [OPENAPI_TAG_USERS],
  request: {
    params: UpdateUserParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: UpdateUserRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: GetUserResponseSchema,
        },
      },
      description: "Update user information",
    },
  },
});

usersApp.openapi(updateUserRoute, async (c) => {
  const { id } = c.req.valid("param");
  const updateUserRequest = c.req.valid("json");
  const updatedUser = await usersService.updateUser(id, updateUserRequest);
  return c.json(updatedUser, 200);
});

/**
 * Delete a user
 */
const deleteUserRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: [OPENAPI_TAG_USERS],
  request: {
    params: DeleteUserParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: GetUserResponseSchema,
        },
      },
      description: "Delete a user",
    },
  },
});

usersApp.openapi(deleteUserRoute, async (c) => {
  const { id } = c.req.valid("param");
  const deletedUser = await usersService.deleteUser(id);
  return c.json(deletedUser, 200);
});

/**
 * Change a user's password
 */
const changePasswordRoute = createRoute({
  method: "patch",
  path: "/{id}/password",
  tags: [OPENAPI_TAG_USERS],
  request: {
    params: ChangePasswordParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: ChangePasswordRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: GetUserResponseSchema,
        },
      },
      description: "Change user password",
    },
  },
});

usersApp.openapi(changePasswordRoute, async (c) => {
  const { id } = c.req.valid("param");
  const changePasswordRequest = c.req.valid("json");
  await usersService.changePassword(id, changePasswordRequest);
  return c.json({ success: true, message: `User ${id} password changed.` });
});
