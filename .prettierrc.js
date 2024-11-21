// @ts-check

/** @type {import("prettier").Config} */
const baseConfig = {
  plugins: ["prettier-plugin-organize-imports"],
  overrides: [
    {
      files: ["**/package.json"],
      options: {
        plugins: ["prettier-plugin-packagejson"],
      },
    },
    {
      files: ["**/*.astro"],
      options: {
        parser: "astro",
        plugins: ["prettier-plugin-astro"],
      },
    },
  ],
};

export default baseConfig;
