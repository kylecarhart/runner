import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { PaginationQuerySchema } from "@runner/api/request";
import {
  ChangePasswordParamsSchema,
  ChangePasswordRequestSchema,
  ChangePasswordResponseSchema,
  DeleteUserParamsSchema,
  GetUserParamsSchema,
  GetUserResponseSchema,
  GetUsersResponseSchema,
  UpdateUserParamsSchema,
  UpdateUserRequestSchema,
} from "@runner/api/user";
import { HonoEnv } from "../../index.js";
import { sessionsMiddleware } from "../../middleware/sessions.middleware.js";
import { logger } from "../../utils/logger.js";
import { contentJson } from "../../utils/openapi.js";
import { data, pagination, success } from "../../utils/response.js";
import {
  changePassword,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "./users.service.js";

const OPENAPI_TAG_USERS = "Users";

export const usersApp = new OpenAPIHono<HonoEnv>()
  /**
   * Query users
   */
  .openapi(
    createRoute({
      method: "get",
      path: "/",
      summary: "Get a paginated list of all users",
      tags: [OPENAPI_TAG_USERS],
      operationId: "getUsers",
      request: {
        query: PaginationQuerySchema,
      },
      responses: {
        200: contentJson("Get all users", GetUsersResponseSchema),
      },
    }),
    async (c) => {
      const params = c.req.valid("query");
      const { data: users, pagination: paginationData } =
        await getAllUsers(params);
      return pagination(c, 200, users, GetUsersResponseSchema, paginationData);
    },
  )
  /**
   * Get current user's profile.
   * NOTE: This must come before the get user by slug route.
   */
  .openapi(
    createRoute({
      method: "get",
      path: "/profile",
      summary: "Get the current user's profile",
      tags: [OPENAPI_TAG_USERS],
      middleware: [sessionsMiddleware()] as const,
      operationId: "getProfile",
      responses: {
        200: contentJson(
          "Get the current user's profile",
          GetUserResponseSchema,
        ),
        401: { description: "Unauthorized" },
      },
    }),
    async (c) => {
      logger().trace("getProfile route called");
      const user = c.var.user();
      return data(c, 200, user, GetUserResponseSchema);
    },
  )
  /**
   * Get a user by ID
   */
  .openapi(
    createRoute({
      method: "get",
      path: "/{id}",
      summary: "Get a specific user by their ID",
      operationId: "getUserById",
      tags: [OPENAPI_TAG_USERS],
      request: {
        params: GetUserParamsSchema,
      },
      responses: {
        200: contentJson("Retrieve the user", GetUserResponseSchema),
      },
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const user = await getUserById(id);
      return data(c, 200, user, GetUserResponseSchema);
    },
  )
  /**
   * Update a user
   */
  .openapi(
    createRoute({
      method: "patch",
      path: "/{id}",
      summary: "Update a user's information",
      tags: [OPENAPI_TAG_USERS],
      operationId: "updateUser",
      request: {
        params: UpdateUserParamsSchema,
        body: contentJson("Update user information", UpdateUserRequestSchema),
      },
      responses: {
        200: contentJson("Update user information", GetUserResponseSchema),
      },
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const updateUserRequest = c.req.valid("json");
      const updatedUser = await updateUser(id, updateUserRequest);
      return data(c, 200, updatedUser, GetUserResponseSchema);
    },
  )
  /**
   * Delete a user
   */
  .openapi(
    createRoute({
      method: "delete",
      path: "/{id}",
      summary: "Delete a user by their ID",
      tags: [OPENAPI_TAG_USERS],
      operationId: "deleteUser",
      request: {
        params: DeleteUserParamsSchema,
      },
      responses: {
        200: { description: "User deleted successfully" },
      },
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      await deleteUser(id);
      return success(c, 200, "User deleted successfully");
    },
  )
  /**
   * Change a user's password
   */
  .openapi(
    createRoute({
      method: "patch",
      path: "/{id}/password",
      summary: "Change a user's password",
      tags: [OPENAPI_TAG_USERS],
      operationId: "changeUserPassword",
      request: {
        params: ChangePasswordParamsSchema,
        body: contentJson("Change user password", ChangePasswordRequestSchema),
      },
      responses: {
        200: contentJson("Change user password", ChangePasswordResponseSchema),
      },
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const changePasswordRequest = c.req.valid("json");
      await changePassword(id, changePasswordRequest);
      return success(c, 200, "Password changed successfully");
    },
  );
