import type { CreateEventRequest, Event } from "@runner/api";
import { InferInsertModel } from "drizzle-orm";
import { db } from "../../database/db.js";
import { invariant } from "../../utils/invariant.js";
import { logger } from "../../utils/logger.js";
import { events } from "./events.schema.js";

const eventsLogger = () => logger().child({ service: "events" });

/**
 * Create a new user
 * @param createEventRequest Event fields
 * @returns Created user
 */
export async function createEvent(
  userId: string,
  createEventRequest: CreateEventRequest,
): Promise<Event> {
  eventsLogger().debug("createEvent", createEventRequest);

  const newEvent: InferInsertModel<typeof events> = {
    ...createEventRequest,
    createdBy: userId,
    status: "draft",
  };

  const createdEvent = (
    await db().insert(events).values(newEvent).returning()
  ).at(0);

  invariant(createdEvent, "Failed to create event.");

  return createdEvent;
}
