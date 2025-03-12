import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  CreateEventRequestSchema,
  CreateEventResponseSchema,
} from "@runner/api/event";
import { HonoEnv } from "../../index.js";
import { sessionsMiddleware } from "../../middleware/sessions.middleware.js";
import { contentJson } from "../../utils/openapi.js";
import { data } from "../../utils/response.js";
import { createEvent } from "./events.service.js";

const OPENAPI_TAG_EVENTS = "Events";

export const eventsApp = new OpenAPIHono<HonoEnv>()
  /**
   * Create an event
   */
  .openapi(
    createRoute({
      method: "post",
      path: "/events",
      summary: "Create an event",
      tags: [OPENAPI_TAG_EVENTS],
      operationId: "createEvent",
      middleware: [sessionsMiddleware()] as const,
      request: {
        body: contentJson("The event to create", CreateEventRequestSchema),
      },
      responses: {
        201: contentJson("Signed up successfully", CreateEventResponseSchema),
      },
    }),
    async (c) => {
      // TODO: Rate limit
      const createEventRequest = c.req.valid("json");
      const user = c.var.user();

      const event = await createEvent(user.id, createEventRequest);

      return data(c, 201, event, CreateEventResponseSchema, "Event created.");
    },
  );
