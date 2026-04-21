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

# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
