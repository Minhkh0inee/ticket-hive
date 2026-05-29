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
npm run test             # Jest (currently no test files exist)
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

# Seat locking TTL (seconds); defaults to 600 if not set
SEAT_LOCK_TTL_SECONDS=600

# PayOS payment gateway (get from PayOS dashboard)
PAYOS_CLIENT_ID=...
PAYOS_API_KEY=...
PAYOS_CHECKSUM_KEY=...

# Frontend
VITE_API_URL=http://localhost:8080
VITE_ENABLE_MSW=true   # Enable Mock Service Worker (requires MSW to be installed)
FRONTEND_URL=http://localhost:5173  # used for CORS / redirect URLs

# Optional
VITE_CLOUDINARY_CLOUD_NAME=...  # Image optimization via optimizeImage()
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
                    → Redis (seat locking, event cache, refresh tokens)
                    → Elasticsearch (event search)
                    → RabbitMQ (publish booking.confirmed)
                         → Worker → Resend (confirmation email)
```

### API Package (`packages/api/src/`)

NestJS modules, one per domain:

| Module | Responsibility |
|--------|---------------|
| `auth` | JWT login/register/refresh, Passport strategies (local, jwt, refresh) |
| `event` | CRUD, Redis caching (5 min list/tag/homepage / 1 hr detail), Elasticsearch indexing |
| `seats` | Fetch seats, Redis locking (`SEAT_LOCK_TTL_SECONDS`, max 4 per user) |
| `bookings` | Create booking (pessimistic lock + compensation pattern), publish to RabbitMQ, fetch user bookings |
| `payments` | PayOS payment link creation, webhook handling, cancel |
| `categories` | List event categories |
| `users` | User profile |
| `elasticsearch` | Shared search integration module |
| `redis` | Shared cache/locking module (`@nestjs-modules/ioredis`) |
| `database` | TypeORM data source, migrations, seeds |
| `common` | Shared guards (`PaymentWebhookGuard`, `RoleGuard`), decorators, interceptors, filters |

**API endpoints:**
- `POST /auth/login` (5 req/60s), `POST /auth/register` (5/60s), `GET /auth/profile`, `POST /auth/refresh` (5/60s), `POST /auth/logout`
- `GET /events`, `GET /events/search`, `GET /events/featured`, `GET /events/:id`, `POST /events`, `PATCH /events/:id`
- `GET /seats/event/:eventId`, `POST /seats/lock`, `POST /seats/unlock`
- `POST /bookings`, `GET /bookings/my`, `GET /bookings/:id`
- `GET /categories`
- `POST /payments` (JWT), `GET /payments/:orderCode`, `DELETE /payments/:orderCode`
- `POST /payments/webhook` (PaymentWebhookGuard, 10 req/60s), `POST /payments/confirm-webhook`

### Worker Package (`packages/worker/src/`)

Listens on RabbitMQ `main_queue` for `booking.confirmed` events, then sends confirmation emails via Resend. Stateless HTTP-wise — no HTTP server, no database.

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
- Redis caching via `@nestjs-modules/ioredis` — all keys/TTLs centralized in `src/common/constant/redis-key.constant.ts` (`RedisKeys`, `RedisTTL`)
- Seat locking uses Redis `SET NX EX` for atomic acquire; TTL read from `SEAT_LOCK_TTL_SECONDS` env via `ConfigService` (default 600s)
- Rate limiting: global 1000 req/60s via `APP_GUARD`; stricter per-endpoint overrides on auth (`5/60s`) and webhook (`10/60s`) via `@Throttle()`
- Structured logging: `nestjs-pino` with `pino-pretty` in dev, JSON in production; `Authorization` header and `password` body field are redacted; `X-Request-Id` propagated per request

### Booking Creation Flow
1. Validate seat locks in Redis (caller must own all locks)
2. Open a DB transaction with `pessimistic_write` lock on seats
3. Create `Booking` (PENDING), mark seats BOOKED, decrement `availableSeats`
4. Unlock seats in Redis
5. Call `createPaymentWithRetry()` — generates a random 12-digit `orderCode` via `nanoid`, retries up to 3× on unique-constraint collision
6. Persist a `Payment` record (PENDING) with the `checkoutUrl`
7. Return `{ booking, paymentUrl }` — email is sent asynchronously after PayOS webhook confirms payment
8. On failure: `compensateFailedPayment()` cancels the booking and restores seat status + `availableSeats`

### PayOS Payment Integration
- `PaymentsModule` registers `PayOS` client as `'PAYOS_CLIENT'` provider
- Webhook endpoint is protected by `PaymentWebhookGuard` which verifies the PayOS signature and attaches `req.webhookData`
- `handlePaymentWebhook` is **awaited** in the controller; PayOS retries on non-200
- On success (`code === '00'`): marks Payment COMPLETED, Booking CONFIRMED, publishes `booking.confirmed` to RabbitMQ
- On cancel (`code === 'CANCELLED'`): marks Payment CANCELLED, Booking CANCELLED, restores seat statuses and `availableSeats`
- Idempotent: checks `payment.status` before updating to avoid re-processing duplicate webhooks

### Redis Key Namespaces
All key builders and TTLs live in `src/common/constant/redis-key.constant.ts`:
- `refresh:{userId}` — refresh tokens (7-day TTL)
- `seat_lock:{eventId}:{seatId}` — seat reservations (`SEAT_LOCK_TTL_SECONDS`, default 600s)
- `events:item:{id}` — event detail cache (1 hr)
- `events:list:{offset}:{limit}:{filters}` — paginated list cache (5 min)
- `events:tag:{tag}` — tag-filtered list cache (5 min)
- `events:homepage` — homepage sections cache (5 min)

### Worker — RabbitMQ Consumer
- Queue: `main_queue` (durable: false); DLQ: `booking.confirmed.dlq` (asserted on startup)
- Idempotency: `email:sent:{bookingId}` key in Redis (7-day TTL) prevents duplicate sends
- Retry counter: `worker:retry:{bookingId}` in Redis (24h TTL) — survives restarts; routes to DLQ after `MAX_RETRIES` (3) failures
- Manual ack: `channel.ack()` on success or after DLQ routing; `channel.nack(msg, false, true)` to requeue on transient failures

### Database
- TypeORM with PostgreSQL on Neon (cloud-hosted); `synchronize: false` in all environments
- Migrations in `packages/api/src/database/migrations/`
- Seeds in `packages/api/src/database/seeds/`
- Data source config in `packages/api/src/database/data-source.ts`
- Connection pool: max 10, min 2, 30s idle timeout

### Infrastructure (Docker Compose)
`docker-compose.yml` at root spins up: Redis, Elasticsearch, RabbitMQ, API, Worker, Frontend — all with health checks. Use `npm run dev` from root for a full local stack.

## Known Gaps / TODO
- **Zero tests** across all three packages (CI uses `--passWithNoTests`)
- MSW is documented and env-gated but not installed — `VITE_ENABLE_MSW=true` has no effect until set up
- `SessionExpiredDialog` exists in frontend but is commented out in `App.tsx`
- No password-reset or email-verification flow
- No observability (Sentry, metrics, `/healthz`/`/readyz` endpoints)
- Admin UI is absent — event CRUD endpoints exist but no frontend for them
- Elasticsearch reindex loads full events table — won't scale past ~10k rows
