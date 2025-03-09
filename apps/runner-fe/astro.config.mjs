// @ts-check
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
      // configPath: "./wrangler.jsonc",
    },
  }),
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false, // For shadcn
    }),
  ],
});
