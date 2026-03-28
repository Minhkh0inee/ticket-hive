# TicketHive

A full-stack ticket booking platform built as a monorepo. Users can browse events, select seats, and receive booking confirmations by email.

---
🔗 **Live Demo:** [tickethive.minh-khoi.com](https://tickethive.minh-khoi.com)  
🔗 **API:** [api-tickethive.minh-khoi.com](https://api-tickethive.minh-khoi.com)
--

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, TypeScript 5 |
| State Management | Redux Toolkit + Redux-Saga |
| Styling | Tailwind CSS v4, shadcn/ui |
| API | NestJS 11, TypeScript 5 |
| Database | PostgreSQL via [Neon](https://neon.tech) (TypeORM) |
| Caching & Locking | Redis (ioredis) via Upstash |
| Search | Elasticsearch (OpenSearch via Bonsai.io) |
| Message Queue | RabbitMQ via CloudAMQP |
| Email | Resend |
| Auth | JWT (access + refresh tokens), bcrypt |
| Deploy | Railway (API), Vercel (Frontend), Cloudflare CDN |
| CI/CD | GitHub Actions |

---

## Architecture

```
Browser
  └── React SPA (Vite, port 5173)
        └── Redux Saga → Axios (JWT interceptor)
              └── NestJS REST API (port 8080)
                    ├── PostgreSQL / Neon ── persistent data
                    ├── Redis              ── seat locking (5-min TTL), event cache
                    ├── Elasticsearch      ── full-text event search
                    └── RabbitMQ           ── async booking events
                                                └── NestJS Worker
                                                      └── Resend ── confirmation emails
```

### Packages

| Package | Role |
|---|---|
| `packages/api` | NestJS HTTP server — auth, events, seats, bookings, categories |
| `packages/worker` | NestJS microservice — consumes RabbitMQ booking events, sends emails |
| `packages/frontend` | React SPA — all UI, Redux store, sagas |

### Key Flows

- **Seat selection** — seats are locked in Redis for 5 minutes while a user checks out; max 4 seats per booking
- **Booking** — API persists the booking to PostgreSQL, then publishes an event to RabbitMQ; the Worker picks it up and sends an email via Resend asynchronously
- **Search** — events are indexed to Elasticsearch on create/update; `GET /events/search` queries it
- **Auth** — short-lived access token + long-lived refresh token; the frontend intercepts 401s, queues concurrent requests, and replays them after a silent token refresh

---

## Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- A free [Neon](https://neon.tech) account for PostgreSQL

---

## Setup Guide

### 1. Clone and install

```bash
git clone <repo-url>
cd tickethive
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` — the only values you must change:

```env
# From your Neon project dashboard
DATABASE_URL=postgresql://user:pass@ep-xxxx.us-east-1.aws.neon.tech/tickethive?sslmode=require

# Generate with: openssl rand -hex 32
JWT_SECRET=...
JWT_REFRESH_SECRET=...

# Optional — for booking confirmation emails (https://resend.com)
RESEND_API_KEY=...
```

All other values (Redis, RabbitMQ, Elasticsearch) are pre-configured to match the Docker containers.

### 3. Run database migrations

```bash
npm run migration:run --workspace=packages/api
```

Optionally seed the database with sample data:

```bash
npm run seed --workspace=packages/api
```

### 4. Start all services

```bash
npm run dev
```

This runs `docker-compose up --build` and starts everything. First run takes a few minutes while Docker pulls images.

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:8080 |
| RabbitMQ dashboard | http://localhost:15672 — `guest` / `guest` |
| Elasticsearch | http://localhost:9200 |

All services support **hot reload** — changes under any `src/` folder apply instantly.

### Running services individually

To run without Docker (infrastructure containers must already be running):

```bash
npm run dev:api        # API on :8080
npm run dev:worker     # Worker
npm run dev:frontend   # Frontend on :5173
```

---

## Common Commands

```bash
# Tests (API)
npm run test --workspace=packages/api
npm run test:watch --workspace=packages/api
npm run test:cov --workspace=packages/api

# Lint
npm run lint --workspace=packages/api
npm run lint --workspace=packages/frontend

# Database
npm run migration:generate --workspace=packages/api
npm run migration:run --workspace=packages/api
npm run seed --workspace=packages/api
```

---

## Project Structure

```
tickethive/
├── docker-compose.yml       # Full local stack
├── .env.example             # Environment variable template
└── packages/
    ├── api/                 # NestJS API
    │   └── src/
    │       ├── auth/        # JWT auth, Passport strategies
    │       ├── event/       # Event CRUD + caching + search indexing
    │       ├── seats/       # Seat fetch + Redis locking
    │       ├── bookings/    # Booking creation + RabbitMQ publish
    │       ├── categories/  # Event categories
    │       ├── elasticsearch/
    │       ├── redis/
    │       └── database/    # TypeORM migrations & seeds
    ├── worker/              # NestJS RabbitMQ consumer + Resend email
    └── frontend/            # React SPA
        └── src/
            ├── components/  # UI components by feature
            ├── pages/       # 9 route-level pages
            ├── stores/      # Redux slices + sagas
            ├── services/    # Axios service layer
            ├── types/       # Shared TypeScript types
            └── lib/         # Axios instance, formatters, utilities
```
