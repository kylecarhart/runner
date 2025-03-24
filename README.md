# Runner Monorepo

A full-stack application for managing running events and races. Built with modern web technologies and deployed on Cloudflare's edge network.

## Apps

### Web (`apps/web`)

- Built with Astro + React
- Deployed to Cloudflare Pages
- Features:
  - Race registration
  - Community features

### Dash (`apps/dash`)

- Built with Vite + React + Tanstack
- Deployed to Cloudflare Pages
- Features:
  - Event creation and management

### Backend (`apps/api`)

- Built with Hono.js
- Deployed to Cloudflare Workers
- Features:
  - REST API with OpenAPI documentation
  - PostgreSQL database integration
  - Email notifications via Postmark
  - Session-based authentication

## Packages

### @runner/config-ts

Shared typescript configs

### @runner/postmark

Fetch-based Postmark API client for edge environments.

### @runner/schemas

Shared API types and schemas between frontend and backend.\

### @runner/ui

Reusable ui components

### @runner/utils

Shared utilities and constants.

## Development

### Prerequisites

- Node.js v22+
- PNPM v9+
- Cloudflare Wrangler CLI
