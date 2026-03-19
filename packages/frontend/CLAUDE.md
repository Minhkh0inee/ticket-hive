# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start Vite dev server on port 5173 (or port 3000 via Docker)
npm run build        # TypeScript compile + Vite production build
npm run lint         # Run ESLint
npm run preview      # Preview production build locally
```

From the monorepo root (`../../`):
```bash
npm run dev:frontend  # Frontend only
npm run dev           # All services via docker-compose
```

There are no test scripts configured yet.

## Architecture

This is the frontend package of **TicketHive**, a ticket booking platform. It's part of a monorepo with a NestJS API (`packages/api`) and a NestJS worker (`packages/worker`).

**Stack:** React 19, Redux Toolkit + Redux Saga, Tailwind CSS v4, shadcn/ui, Vite 7, TypeScript 5

**Path alias:** `@` maps to `./src` (configured in both `vite.config.ts` and `tsconfig.json`).

**Environment variables** (copy `.env.example` to `.env`):
- `VITE_API_BASE_URL` — backend API base URL (default: `http://localhost:8080`)
- `VITE_ENABLE_MSW` — enable Mock Service Worker for API mocking during development

### Intended Directory Layout
```
src/
├── components/
│   └── ui/       # shadcn/ui generated components (do not edit manually)
├── hooks/        # Custom React hooks
├── pages/        # Page-level components (route targets)
├── services/     # HTTP clients / API call functions
├── stores/       # Redux slices and sagas
├── types/        # TypeScript type definitions
└── mocks/        # MSW request handlers
```

The project is in early development (Phase 4 UI). The scaffold directories exist but most are empty — build out pages, Redux slices, sagas, and service functions as features are added.

### State Management Pattern

Uses **Redux Toolkit** for slice/action definitions and **Redux Saga** for async side effects. Service functions in `services/` should handle raw HTTP calls; sagas in `stores/` orchestrate async flows and dispatch actions.

### Backend Context

The API runs on port 8080 and backs these domains (from prior phases):
- Seat availability with Redis locking
- Booking flow via RabbitMQ + email confirmation
- Elasticsearch-powered event search
- PostgreSQL (Neon) for persistence

## Conventions
- Commit: conventional commits (feat/fix/chore/refactor/docs...)
- One commit per ticket
- Component: PascalCase, file name must match component name (e.g. `BookingCard.tsx`)
- Hook: prefix `use` (e.g. `useBooking.ts`)
- Service: camelCase + suffix `Service` (e.g. `bookingService.ts`)
- Slice: camelCase + suffix `Slice` (e.g. `bookingSlice.ts`)

## Patterns
- API calls: `services/` → saga in `stores/` → dispatch action → component subscribes
- Never call API directly from a component or hook
- Standard Redux state shape:
```ts
  {
    data: T | null,
    loading: boolean,
    error: string | null
  }
```
- Styling: Tailwind only — no inline styles or CSS modules
- Imports: always use path alias `@` instead of relative imports
- UI components: use shadcn/ui as the base for all primitive components (Button, Input, Dialog, etc.) — do not build these from scratch
- Extend shadcn components in `components/` when custom behavior is needed, never modify files inside `components/ui/` directly


## Current Status
Phase 4 UI — building out pages, Redux slices, sagas, and service functions.
Backend is fully operational on port 8080.

## Notes
- Tailwind v4: do not use `@apply` with utility classes — syntax differs from v3
- MSW is only enabled when `VITE_ENABLE_MSW=true` is set in `.env`
- API base URL is injected via `VITE_API_BASE_URL` — never hardcode URLs in source code
- Use Redux Saga for all async flows — do not use `createAsyncThunk`
- shadcn/ui components live in `@/components/ui/` — add new ones via CLI: `npx shadcn@latest add <component>`
