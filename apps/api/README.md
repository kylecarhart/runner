# Backend Application for Runner

## Development

```bash
pnpm install
pnpm dev
```

## Environment/Secrets

Environment variables are held within `wrangler.jsonc`. Secrets are held within `.dev.vars`. Copy `.dev.vars.example` to `.dev.vars` and fill in the blanks.

## Globals

Globals are replaced by esbuild during build time, and are marked as `# DEFINE` in the `.env` file. They are defined in `wrangler.toml` under `[define]`.
See [Cloudflare Workers - Build time constants with Wrangler](https://kian.org.uk/cloudflare-workers-build-time-constants-with-wrangler/) for more information.
