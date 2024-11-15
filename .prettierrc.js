const baseConfig = {
  plugins: ["prettier-plugin-organize-imports"],
  overrides: [
    {
      files: ["package.json"],
      options: {
        plugins: ["prettier-plugin-packagejson"],
      },
    },
  ],
};

export default baseConfig;
