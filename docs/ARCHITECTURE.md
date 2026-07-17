# Servee V1 Architecture

## Architecture principles

- Mobile-first guest experience with no required installation
- Multi-tenant isolation by restaurant and location
- Real-time order state across guest, staff and kitchen surfaces
- One TypeScript codebase where practical
- Clear domain boundaries before microservices
- Secure-by-default payments and role-based access
- English and Spanish localization from the beginning

## Monorepo target

```text
servee/
├── apps/
│   ├── guest/       # customer ordering PWA
│   ├── staff/       # waiter and manager workspace
│   ├── kitchen/     # kitchen display system
│   ├── admin/       # restaurant configuration dashboard
│   └── api/         # application API and real-time gateway
├── packages/
│   ├── database/    # Prisma schema, migrations and seed data
│   ├── ui/          # shared design system
│   ├── auth/        # authentication and authorization helpers
│   ├── contracts/   # shared schemas and domain types
│   ├── config/      # shared TypeScript, lint and environment config
│   └── observability/
├── docs/
└── infrastructure/
```

## Proposed stack

- Next.js, React and TypeScript for web applications
- Tailwind CSS and a shared Servee component system
- NestJS for the API and WebSocket gateway
- PostgreSQL with Prisma ORM
- Redis for transient sessions, queues and real-time coordination
- S3-compatible object storage for menu media
- Stripe Connect for restaurant payment onboarding and routing
- OpenTelemetry-compatible logging and tracing

## Core domains

- Identity and access
- Restaurant organization
- Locations and tables
- Menus, items and modifiers
- Table sessions
- Orders and order items
- Kitchen tickets and stations
- Service requests
- Checks and payments
- Audit events

## Multi-tenant model

Every operational record is scoped to a restaurant organization and, where relevant, a location. Authorization must validate tenant membership rather than trusting identifiers from the client.

## Real-time event examples

- `table.session.opened`
- `order.submitted`
- `order.confirmed`
- `ticket.preparing`
- `ticket.ready`
- `service.requested`
- `check.requested`
- `table.closed`

The database remains the source of truth. Real-time messages notify clients to refresh or apply validated state transitions.

## Initial deployment shape

V1 should begin as a modular monolith with separately deployable web surfaces. This keeps delivery fast while preserving domain boundaries that can later become services when scale or operational needs justify it.
