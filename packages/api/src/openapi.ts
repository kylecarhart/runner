import { z } from "zod";
import { createDocument } from "zod-openapi";
import { withSuccessResponseSchema } from "./response";
import { GetUserResponseSchema } from "./user";

export const document = createDocument({
  openapi: "3.1.0",
  info: {
    title: "My API",
    version: "1.0.0",
  },
  paths: {
    "/api/v1/users/{id}": {
      get: {
        requestParams: { path: z.object({ id: z.string() }) },
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
                schema: withSuccessResponseSchema(GetUserResponseSchema),
              },
            },
          },
        },
      },
    },
  },
});
