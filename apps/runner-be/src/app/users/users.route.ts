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
          schema: CreateUserResponseSchema,
        },
      },
      description: "Create a new user",
    },
  },
});

// TODO: We may need to chain these for RPC: https://hono.dev/docs/guides/best-practices
usersApp.openapi(createUserRoute, async (c) => {
  const createUserRequest = c.req.valid("json");
  const newUser = await usersService.createUser(createUserRequest);

  return c.json(
    {
      success: true,
      data: newUser,
    } as const,
    200,
  );
});

/**
 * Query users
 */
const getUsers = createRoute({
  method: "get",
  path: "/",
  tags: [OPENAPI_TAG_USERS],
  request: {
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: GetUsersResponseSchema,
        },
      },
      description: "Get all users",
    },
  },
});

usersApp.openapi(getUsers, async (c) => {
  const params = c.req.valid("query");
  const { data, pagination } = await usersService.getAllUsers(params);

  return c.json(
    {
      success: true,
      data,
      pagination,
    } as const,
    200,
  );
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
  return c.json(
    {
      success: true,
      data: user,
    } as const,
    200,
  );
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
  return c.json(
    {
      success: true,
      data: updatedUser,
    } as const,
    200,
  );
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
          schema: DeleteUserResponseSchema,
        },
      },
      description: "Delete a user",
    },
  },
});

usersApp.openapi(deleteUserRoute, async (c) => {
  const { id } = c.req.valid("param");
  await usersService.deleteUser(id);
  return c.json(
    {
      success: true,
      message: "User deleted successfully",
    } as const,
    200,
  );
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
          schema: ChangePasswordResponseSchema,
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

  return c.json(
    {
      success: true,
      message: "Password changed successfully",
    } as const,
    200,
  );
});
