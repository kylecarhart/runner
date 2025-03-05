// @ts-check

/** @type {import("prettier").Config} */
const baseConfig = {
  plugins: ["prettier-plugin-organize-imports"],
  overrides: [
    // Auto format package json files
    {
      files: ["**/package.json"],
      options: {
        plugins: ["prettier-plugin-packagejson"],
      },
    },
    // JSONC is non-standard and vscode warns on trailing commas.
    {
      files: ["**/*.jsonc"],
      options: {
        trailingComma: "none",
      },
    },
    // Astro
    {
      files: ["**/*.astro"],
      options: {
        parser: "astro",
        plugins: [
          "prettier-plugin-astro",
          "prettier-plugin-tailwindcss",
          "prettier-plugin-astro-organize-imports", // MUST come last
        ],
        tailwindFunctions: ["clsx", "cva", "cn", "twMerge"], // Sort in these funcs
      },
    },
  ],
};

export default baseConfig;
