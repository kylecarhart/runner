# Backend Application for Runner

## Development

```bash
pnpm install
pnpm dev
```

## Environment/Secrets

Create a `.env` file in the root of the project with the following content. Do not remove the `# SECRET` or `# DEFINE` comments. Run `pnpm run env` to generate the `wrangler.toml` and `.dev.vars` files.

```properties
# Environment
ENVIRONMENT=development # DEFINE
LOG_LEVEL=info

# Server
PORT=3000
ALLOWED_ORIGIN=https://runner.carhart.dev

# Database
DB_HOST=aws-0-us-east-1.pooler.supabase.com
DB_PORT_TRANSACTION=6543
DB_PORT_SESSION=5432
DB_USER= # SECRET
DB_PASSWORD= # SECRET
DB_NAME=postgres

```

## Globals

Globals are replaced by esbuild during build time, and are marked as `# DEFINE` in the `.env` file. They are defined in `wrangler.toml` under `[define]`.
See [Cloudflare Workers - Build time constants with Wrangler](https://kian.org.uk/cloudflare-workers-build-time-constants-with-wrangler/) for more information.
