# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Root-level (from `/`)
```bash
npm run dev              # Start all services via docker-compose (recommended for full-stack dev)
npm run dev:frontend     # Frontend only (Vite, port 5173)
npm run dev:api          # API only (NestJS, port 8080)
npm run dev:worker       # Worker only (NestJS microservice)
```

### API (`packages/api/`)
```bash
npm run start:dev        # Watch mode
npm run build            # Compile to dist/
npm run test             # Jest
npm run test:watch       # Jest watch
npm run test:cov         # Coverage
npm run lint             # ESLint --fix
npm run migration:generate  # Generate TypeORM migration
npm run migration:run    # Run pending migrations
npm run seed             # Seed database
```

### Worker (`packages/worker/`)
```bash
npm run start:dev        # Watch mode
npm run build            # Compile to dist/
npm run test             # Jest
npm run lint             # ESLint --fix
```

### Frontend (`packages/frontend/`)
See `packages/frontend/CLAUDE.md` for full frontend guidance.
```bash
npm run dev              # Vite dev server (port 5173)
npm run build            # Production build
npm run lint             # ESLint
```

## Environment Setup

Copy `.env.example` to `.env` at the root. Required variables:

```bash
# PostgreSQL (Neon cloud — requires account)
DATABASE_URL=postgresql://...

# JWT secrets (generate with: openssl rand -hex 32)
JWT_SECRET=...
JWT_REFRESH_SECRET=...

# Docker defaults (work as-is with docker-compose)
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://guest:guest@localhost:5672
ELASTICSEARCH_URL=http://localhost:9200

# Frontend
VITE_API_URL=http://localhost:8080
VITE_ENABLE_MSW=true   # Enable Mock Service Worker
```

## Architecture

**TicketHive** is a monorepo ticket booking platform with three packages:

```
packages/
├── api/      NestJS REST API           — port 8080
├── worker/   NestJS RabbitMQ consumer  — no HTTP port
└── frontend/ React SPA (Vite)          — port 5173
```

### Request Flow

```
Browser → React (Redux Saga) → Axios (JWT interceptor)
       → NestJS API → PostgreSQL (TypeORM, Neon)
                    → Redis (seat locking, event cache)
                    → Elasticsearch (event search)
                    → RabbitMQ (publish booking event)
                         → Worker → Resend (email)
```

### API Package (`packages/api/src/`)

NestJS modules, one per domain:

| Module | Responsibility |
|--------|---------------|
| `auth` | JWT login/register/refresh, Passport strategies (local, jwt, refresh) |
| `event` | CRUD, Redis caching (5 min list / 1 hr detail), Elasticsearch indexing |
| `seats` | Fetch seats, Redis locking (5-min TTL, max 4 per user) |
| `bookings` | Create booking, publish to RabbitMQ, fetch user bookings |
| `categories` | List event categories |
| `users` | User profile |
| `elasticsearch` | Shared search integration module |
| `redis` | Shared cache/locking module (`@nestjs-modules/ioredis`) |
| `database` | TypeORM data source, migrations, seeds |

**API endpoints:**
- `POST /auth/login`, `POST /auth/register`, `GET /auth/profile`, `POST /auth/refresh`, `POST /auth/logout`
- `GET /events`, `GET /events/search`, `GET /events/featured`, `GET /events/:id`, `POST /events`, `PATCH /events/:id`
- `GET /seats/event/:eventId`, `POST /seats/lock`, `POST /seats/unlock`
- `POST /bookings`, `GET /bookings/my`, `GET /bookings/:id`
- `GET /categories`

### Worker Package (`packages/worker/src/`)

Listens on a RabbitMQ queue for booking-created events, then sends confirmation emails via Resend. Stateless — no HTTP server, no database.

### Frontend Package

See `packages/frontend/CLAUDE.md` for the full frontend architecture (routing, Redux store shape, sagas, conventions).

Key points:
- **Never call the API directly from components** — always go through Redux actions → sagas → services
- Two saga files have intentional `.sage.ts` extension typos (`seat.sage.ts`, `category.sage.ts`) — keep as-is
- `ProtectedRoute` component file is named `ProctectedRoute.tsx` (typo) — keep as-is

## Key Patterns

### NestJS API
- Controllers validate with DTOs (`class-validator`); services contain business logic
- Auth guards: `JwtAuthGuard` (access token), `RefreshTokenGuard` (refresh), `LocalAuthGuard` (login)
- Redis caching via `@nestjs-modules/ioredis` — keys follow `event:list:*` / `event:item:{id}` pattern
- Seat locking uses Redis `SET NX EX` for atomic acquire
- Booking creation publishes a message to RabbitMQ; the HTTP response does not wait for email delivery

### Database
- TypeORM with PostgreSQL on Neon (cloud-hosted)
- Migrations in `packages/api/src/database/migrations/`
- Seeds in `packages/api/src/database/seeds/`
- Data source config in `packages/api/src/database/data-source.ts`

### Infrastructure (Docker Compose)
`docker-compose.yml` at root spins up: Redis, Elasticsearch, RabbitMQ, API, Worker, Frontend — all with health checks. Use `npm run dev` from root for a full local stack.
