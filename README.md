# TicketHive

A ticket management and sales platform. The project is structured as a monorepo with three services: a REST API, a background worker, and a React frontend.

## What's inside

| Package | Tech | Purpose |
|---|---|---|
| `packages/api` | NestJS | HTTP API server |
| `packages/worker` | NestJS | Background job processor |
| `packages/frontend` | React + Vite | Web UI |

Supporting infrastructure (managed via Docker):

- **PostgreSQL** (Neon cloud) — primary database
- **Redis** — caching and seat locking
- **Elasticsearch** — search
- **RabbitMQ** — message queue between API and Worker

---

## Prerequisites

Make sure you have these installed before you start:

- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- A free [Neon](https://neon.tech) account for the PostgreSQL database

---

## Getting started

### 1. Clone the repo and install dependencies

```bash
git clone <repo-url>
cd tickethive
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and update at minimum:

```env
# Get this from your Neon project dashboard
DATABASE_URL=postgresql://username:password@ep-xxxx.us-east-1.aws.neon.tech/tickethive?sslmode=require

# Generate two long random strings (e.g. run: openssl rand -hex 32)
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
```

The other values (Redis, Elasticsearch, RabbitMQ) point to the Docker containers and can stay as-is.

### 3. Start everything

```bash
npm run dev
```

This runs `docker-compose up --build`, which starts all services. The first run will take a few minutes while Docker pulls images and builds the containers.

Once running:

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:8080 |
| RabbitMQ dashboard | http://localhost:15672 (guest / guest) |
| Elasticsearch | http://localhost:9200 |

All three application services support **hot reload** — edit files under any `src/` folder and changes apply instantly without restarting Docker.

---

## Running services individually (without Docker)

If you prefer to run services locally, start the infrastructure containers first (Redis, Elasticsearch, RabbitMQ), then run each service separately:

```bash
npm run dev:api        # API on :8080
npm run dev:worker     # Worker
npm run dev:frontend   # Frontend on :5173
```

---

## Other useful commands

```bash
# Run tests for the API
npm run test --workspace=packages/api

# Run tests in watch mode
npm run test:watch --workspace=packages/api

# Generate a coverage report
npm run test:cov --workspace=packages/api

# Lint & auto-fix
npm run lint --workspace=packages/api
npm run lint --workspace=packages/frontend

# Format with Prettier
npm run format --workspace=packages/api
```

---

## Project structure

```
tickethive/
├── docker-compose.yml       # Starts all services together
├── .env.example             # Environment variable template
├── db/
│   ├── migrations/          # Database migration files
│   └── seeds/               # Database seed files
└── packages/
    ├── api/                 # NestJS API (src/, test/)
    ├── worker/              # NestJS Worker (src/, test/)
    └── frontend/            # React app (src/)
```
