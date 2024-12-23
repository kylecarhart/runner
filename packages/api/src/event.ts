import { z } from "zod";
import { baseFields } from "./base.js";
import { withSuccessSchema } from "./response.js";

/**
 * Select event schema
 */
export const SelectEventSchema = z.object({
  ...baseFields,
  name: z.string().min(1).max(64),
  description: z.string().min(1).max(1024),
  createdBy: z.string().uuid(),
  // startDate: z.string(),
  // endDate: z.string().nullable(),
  status: z.enum(["draft", "published", "completed"]),
  address: z.string().min(1).max(128),
  city: z.string().min(1).max(64),
  state: z.string().min(1).max(64),
  zip: z.string().min(1).max(16),
});
export type Event = z.infer<typeof SelectEventSchema>;

/**
 * Create an event
 */
export const CreateEventRequestSchema = SelectEventSchema.pick({
  name: true,
  description: true,
  address: true,
  city: true,
  state: true,
  zip: true,
});
export type CreateEventRequest = z.infer<typeof CreateEventRequestSchema>;
export const CreateEventResponseSchema = withSuccessSchema(SelectEventSchema);
