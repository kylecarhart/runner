import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  // Emit declaration maps, useful for drilling straight to definitions
  onSuccess: "tsc --emitDeclarationOnly --declaration",
});
