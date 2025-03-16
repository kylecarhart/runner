# Runner Monorepo

A full-stack application for managing running events and races. Built with modern web technologies and deployed on Cloudflare's edge network.

## Applications

### Frontend (`apps/web`)

- Built with Astro + React
- Deployed to Cloudflare Pages
- Features:
  - Event creation and management
  - Race registration
  - User authentication
  - Community features

### Backend (`apps/api`)

- Built with Hono.js
- Deployed to Cloudflare Workers
- Features:
  - REST API with OpenAPI documentation
  - PostgreSQL database integration
  - Email notifications via Postmark
  - Session-based authentication

## Packages

### @runner/api

Shared API types and schemas between frontend and backend.

### @runner/postmark

Fetch-based Postmark API client for edge environments.

### @runner/utils

Shared utilities and constants.

## Development

### Prerequisites

- Node.js v22+
- PNPM v9+
- Cloudflare Wrangler CLI
