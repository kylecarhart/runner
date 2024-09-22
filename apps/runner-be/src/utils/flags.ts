import z from "zod";

const FlagSchema = z.object({
  id: z.string(),
  description: z.string().optional(),
  enabled: z.boolean().default(false),
});

// TODO: Eventually use FlagsSchema to validate feature flags from another source
const FlagsSchema = z.record(z.string(), FlagSchema);

const Flags = {
  RESPONSE_VALIDATION: {
    id: "RESPONSE_VALIDATION",
    description: "Enable response validation with zod.",
    enabled: true,
  },
} as const satisfies z.infer<typeof FlagsSchema>;

/**
 * Check if a feature flag is enabled.
 * @param flag Feature flag
 * @returns True if the flag is enabled
 */
export function enabled(flag: keyof typeof Flags) {
  return Flags[flag].enabled;
}
