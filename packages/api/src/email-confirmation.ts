import { z } from "./zod.js";

export const ConfirmEmailRequestSchema = z.object({
  email: z.string(),
  code: z.string().length(6),
});
export type ConfirmEmailRequest = z.infer<typeof ConfirmEmailRequestSchema>;
