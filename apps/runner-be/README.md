# Backend Application for Runner

## Development

```bash
pnpm install
pnpm dev
```

## Environment/Secrets

```properties
# .dev.vars
DB_USER=""
DB_PASSWORD=""
```

## Globals

Globals are replaced by esbuild during build time. They are defined in `wrangler.toml` under `[define]`.
See [Cloudflare Workers - Build time constants with Wrangler](https://kian.org.uk/cloudflare-workers-build-time-constants-with-wrangler/) for more information.
