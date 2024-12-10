import { z } from "zod";

export const EmailConfirmationRequestSchema = z.object({
  email: z.string(),
  code: z.string(),
});
