# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start all services (Docker required)
npm run dev

# Run individual services locally (requires infrastructure containers running)
npm run dev:api        # NestJS API on :8080
npm run dev:worker     # NestJS Worker
npm run dev:frontend   # React frontend on :5173

# Workspace-scoped commands
npm run test --workspace=packages/api
npm run test:watch --workspace=packages/api
npm run test:cov --workspace=packages/api
npm run lint --workspace=packages/api
npm run lint --workspace=packages/frontend
npm run format --workspace=packages/api

# Database (run from packages/api)
npm run migration:generate
npm run migration:run
npm run migration:revert
npm run seed
```

## Architecture

TicketHive is a ticket booking platform structured as a npm workspace monorepo with three packages:

- **`packages/api`** — NestJS REST API (port 8080): authentication, events, seats, bookings, payments
- **`packages/worker`** — NestJS background processor: consumes RabbitMQ messages, sends email confirmations via Resend
- **`packages/frontend`** — React + Vite SPA (port 5173): full booking UI

Supporting infrastructure (Docker):
- **PostgreSQL (Neon cloud)** — primary DB via TypeORM with migrations
- **Redis** — seat locking with TTL (`SEAT_LOCK_TTL_SECONDS`), max 4 seats per user for 10 minutes
- **Elasticsearch** — full-text event search via `ElasticModule`
- **RabbitMQ** — async messaging between API and Worker

### API Modules (`packages/api/src/`)

| Module | Responsibility |
|--------|---------------|
| `AuthModule` | JWT + Passport (local + JWT strategies), login/register, token refresh |
| `EventModule` | Event listing, filters, Elasticsearch-backed search |
| `SeatsModule` | Seat availability, Redis-based locking |
| `BookingsModule` | Booking creation and retrieval |
| `UsersModule` | User profiles |
| `PaymentsModule` | Payment processing |
| `ElasticModule` | Elasticsearch integration |
| `CommonModule` | Shared guards, interceptors, filters, decorators |

### Frontend (`packages/frontend/src/`)

**Stack:** React 19, Redux Toolkit + Redux Saga, Tailwind CSS v4, shadcn/ui, Vite 7, TypeScript 5, React Router DOM 7, React Hook Form + Zod, Axios, Sonner

**Path alias:** `@` → `./src`

**State management pattern:** All async flows go through sagas — never call APIs directly from components. The pattern is: `services/` (HTTP) → `stores/sagas/` (orchestration) → `stores/slices/` (state) → component via `useAppSelector`.

**Redux slices:** `auth`, `event`, `home`, `seat`, `booking`

**Key sagas:**
- `auth.saga` — login, register, token refresh with request queue (prevents concurrent refresh storms)
- `home.saga` — sequential featured/special/trending/newEvents (with `ignoreIds` dedup), then parallel category fetches
- `seat.saga` (`seat.sage.ts` — misnamed, keep as-is) — lock/unlock seats via `Promise.all`
- `booking.saga` — create booking, fetch my bookings, fetch booking detail

**HTTP client (`lib/axios.ts`):** Injects JWT token; on 401 queues requests, performs single token refresh, then replays; on refresh failure dispatches `refreshTokenFailed` which sets `sessionExpired: true`.

**Routes:**

| Path | Page | Auth |
|------|------|------|
| `/` | HomePage | public |
| `/events` | EventsPage | public |
| `/events/:id` | EventDetailPage | public |
| `/checkout` | CheckoutPage | public |
| `/confirmation/:bookingId` | ConfirmationPage | public |
| `/login` | LoginPage | public |
| `/register` | RegisterPage | public |
| `/profile` | ProfilePage | protected |
| `/my-tickets` | MyTicketsPage | protected |

## Conventions

**Frontend:**
- Styling: Tailwind only — no inline styles, no CSS modules
- Imports: always use `@/` alias, never relative imports
- UI primitives: always use shadcn/ui base; extend in `components/` — never edit `components/ui/` directly; add new ones via `npx shadcn@latest add <component>`
- Forms: React Hook Form + Zod
- Toasts: `import { toast } from 'sonner'`
- Formatting: `fmtDate`, `fmtDateRange`, `fmtPrice` from `@/lib/format` (vi-VN locale)
- Class merging: `cn(...)` from `@/lib/utils`
- Do not use `createAsyncThunk` — use Redux Saga for all async
- Tailwind v4: do not use `@apply` with utility classes (syntax differs from v3)
- `VITE_API_URL` for backend URL, `VITE_ENABLE_MSW=true` to enable MSW mock data

**Naming:**
- Components: PascalCase, filename must match component name (`BookingCard.tsx`)
- Hooks: `use` prefix (`useBooking.ts`)
- Services: camelCase + `Service` suffix (`bookingService.ts`)
- Slices: camelCase + `Slice` suffix (`bookingSlice.ts`)
- Commits: conventional commits (`feat/fix/chore/refactor/docs`), one commit per ticket

**Redux state shape convention:**
```ts
{ data: T | null, loading: boolean, error: string | null }
```

## Environment Setup

Copy `.env.example` to `.env`. Required values:
- `DATABASE_URL` — Neon PostgreSQL connection string
- `JWT_SECRET` and `JWT_REFRESH_SECRET` — generate with `openssl rand -hex 32`

Redis, Elasticsearch, and RabbitMQ values default to Docker container addresses and can stay as-is for local development.
