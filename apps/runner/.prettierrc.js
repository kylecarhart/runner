import baseConfig from '../../.prettierrc.js'

const config = {
  ...baseConfig,
  plugins: [...baseConfig.plugins, "prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
  overrides: [{ "files": "*.svelte", "options": { "parser": "svelte" } }]
}

export default config;