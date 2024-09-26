import { createDocument, ZodOpenApiPathsObject } from "zod-openapi";
import { withSuccessResponseSchema } from "./response";
import { GetUserParamsSchema, GetUserResponseSchema } from "./user";

export const document = createDocument({
  openapi: "3.1.0",
  servers: [
    {
      url: "http://localhost:3000/api/{version}",
      description: "Local server",
      variables: {
        version: { enum: ["v1"], default: "v1" },
      },
    },
  ],
  info: {
    title: "Runner API",
    version: "1.0.0",
  },
  tags: [{ name: "Users", description: "Manage users" }],
  paths: {
    "/users/{id}": {
      get: {
        summary: "Get a user by id",
        tags: ["Users"],
        requestParams: { path: GetUserParamsSchema },
        // requestBody: {
        //   content: {
        //     "application/json": { schema: GetUserResponseSchema },
        //   },
        // },
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": {
                schema: withSuccessResponseSchema(
                  GetUserResponseSchema,
                ).openapi({ ref: "GetUserResponse" }),
              },
            },
          },
        },
      },
    },
  },
});

export const GetUserOpenApiPath = {
  "/users/{id}": {
    get: {
      summary: "Get a user by id",
      tags: ["Users"],
      requestParams: { path: GetUserParamsSchema },
      // requestBody: {
      //   content: {
      //     "application/json": { schema: GetUserResponseSchema },
      //   },
      // },
      responses: {
        "200": {
          description: "200 OK",
          content: {
            "application/json": {
              schema: withSuccessResponseSchema(GetUserResponseSchema).openapi({
                ref: "GetUserResponse",
              }),
            },
          },
        },
        "201": {
          description: "400 Bad Request",
        },
      },
    },
  },
} satisfies ZodOpenApiPathsObject;

// 1. Have each individual contract supply the path and the method
// 2. Combine all the contracts, merging any that have the same path.
//   2a. Throw an error if two contracts have the same path and method.
// 3. Merge the contracts into a single document
// 4. Export the document
