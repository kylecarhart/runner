import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  ChangePasswordParamsSchema,
  ChangePasswordRequestSchema,
  CreateUserRequestSchema,
  CreateUserResponseSchema,
  DeleteUserParamsSchema,
  GetUserParamsSchema,
  GetUserResponseSchema,
  GetUsersResponseSchema,
  PaginationQuerySchema,
  UpdateUserParamsSchema,
  UpdateUserRequestSchema,
  withPagination,
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

usersApp.openapi(createUserRoute, async (c) => {
  const createUserRequest = c.req.valid("json");
  const newUser = await usersService.createUser(createUserRequest);
  return c.json(newUser, 200);
});

/**
 * Query users
 */
const getAllUsers = createRoute({
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
          schema: withPagination(GetUsersResponseSchema),
        },
      },
      description: "Get all users",
    },
  },
});

usersApp.openapi(getAllUsers, async (c) => {
  const params = c.req.valid("query");
  const users = await usersService.getAllUsers(params);
  return c.json(
    {
      data: users,
      success: true,
      pagination: {
        limit: params.limit,
        page: params.page,
        nextPage: params.page + 1,
        prevPage: params.page - 1,
        total: users.length,
      },
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
    204: {
      description: "Delete a user",
    },
  },
});

usersApp.openapi(deleteUserRoute, async (c) => {
  const { id } = c.req.valid("param");
  await usersService.deleteUser(id);
  return c.body(null, 204);
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
    204: {
      description: "Change user password",
    },
  },
});

usersApp.openapi(changePasswordRoute, async (c) => {
  const { id } = c.req.valid("param");
  const changePasswordRequest = c.req.valid("json");
  await usersService.changePassword(id, changePasswordRequest);
  return c.body(null, 204);
});
