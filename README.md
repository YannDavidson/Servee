# Servee

**The AI-powered hospitality platform.**

Servee connects the restaurant customer journey—from table discovery and interactive menus to ordering, kitchen operations, service, payments, analytics, and loyalty.

## V1 mission

Enable a seated guest to scan a table QR code, browse a visual menu, submit an order, have staff confirm it, send it to the kitchen, track its status, and close the table.

## Current foundation

- `apps/guest` — mobile-first Next.js guest menu
- `apps/api` — NestJS API with a health endpoint
- `packages/contracts` — shared domain types
- `packages/ui` — shared Servee interface components
- `packages/database` — Prisma/PostgreSQL data model

## Requirements

- Node.js 20+
- pnpm 10.12.1+
- PostgreSQL 15+

## Local setup

```bash
cp .env.example .env
pnpm install
pnpm --filter @servee/database build
pnpm dev
```

The guest experience runs at `http://localhost:3000` and the API health endpoint at `http://localhost:4000/api/health`.

## Validation

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```

## Status

Servee is in active V1 development.
