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

**Additional libraries:** React Router DOM 7, React Hook Form + Zod, Axios, Sonner (toasts), Next Themes, Lucide React (icons), `@fontsource-variable/geist` (Geist variable font)

**Path alias:** `@` maps to `./src` (configured in both `vite.config.ts` and `tsconfig.json`).

**Environment variables** — `.env` is loaded from the **monorepo root** (`../../`), not from `packages/frontend/`. `vite.config.ts` sets `envDir` accordingly. Copy `.env.example` at the root and run `npm run dev` from there (or use `npm run dev:frontend`):
- `VITE_API_URL` — backend API base URL (default: `http://localhost:8080`)
- `VITE_ENABLE_MSW` — enable Mock Service Worker for API mocking during development
- `VITE_CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name for image optimization via `optimizeImage()` in `src/utils/image.ts`

### Directory Layout
```
src/
├── components/
│   ├── auth/            # LoginForm, RegisterForm
│   ├── checkout/        # CountDown, ExpireModal, OrderSummary, PaymentForm
│   ├── common/          # AuthRequiredDialog, SessionExpiredDialog, BookingDetailDialog,
│   │                    # CategoryBadge, EventCard, EventCardSkeleton, EventGridCard,
│   │                    # GlobalErrorBoundary, Pagination, ScrollToTop, SectionTitle
│   ├── event-detail/    # HeroGallery, EventInfoPanel, EventDescription, EventOrganizer,
│   │                    # EventSidebar, EventMoreSection, EventPromoBanner, EventRelatedSection
│   │                    # schedule/: EventSchedule, SeatMapDialog, SeatMapGrid, SectionList,
│   │                    #            SeatButton, SeatCancelDialog, SeatChip, useSeatMap, constants
│   ├── events/          # CategoryEventRow, CategoryEventRowSkeleton, CitiesSection,
│   │                    # EventDetailError, EventDetailSkeleton, EventFilterBar, EventGrid,
│   │                    # TrendingCard, WeekendMonthSection
│   ├── home/            # CategoryNav, EventRow, HeroBannerSkeleton
│   │   └── sections/    # HeroBanner, SpecialSection, TrendingSection, LatestSection,
│   │                    # MusicSection, TheatreSection, FestivalSection, ConferenceSection, SportsSection
│   ├── layout/          # MainLayout, Header, Footer, SearchBar
│   ├── ui/              # shadcn/ui generated components (do not edit manually)
│   └── ProctectedRoute.tsx  # Route guard (note: intentional typo in filename)
├── hooks/               # useAppDispatch, useAppSelector (typed Redux hooks)
│                        # useBookingSummary, useCheckoutExpire, useCountDown
├── lib/                 # axios.ts (configured instance + interceptors), format.ts, utils.ts
├── mocks/               # Mock data: categories.mock.ts (for MSW / dev)
├── pages/               # 11 route-level page components
├── services/            # auth.service.ts
├── stores/
│   ├── slices/          # auth, event, home, seat, booking, category
│   └── sagas/           # auth, event, home, seat.sage, booking, category.sage, rootSaga
├── types/               # event.types.ts (Event, EventDetail, Seat, Booking, Category, enums)
└── utils/               # seat.utils.ts, applyDateFilter.ts, image.ts
```

### Routing

| Page | Path | Auth | Layout |
|------|------|------|--------|
| HomePage | `/` | public | MainLayout |
| EventsPage | `/events` | public | MainLayout |
| EventDetailPage | `/events/:id` | public | MainLayout |
| ProfilePage | `/profile` | **protected** | MainLayout |
| MyTicketsPage | `/my-tickets` | **protected** | MainLayout |
| LoginPage | `/login` | public | none |
| RegisterPage | `/register` | public | none |
| CheckoutPage | `/checkout` | public | none |
| ConfirmationPage | `/confirmation/:bookingId` | public | none |
| PaymentSuccessPage | `/payment/success` | public | none |
| PaymentCancelPage | `/payment/cancel` | public | none |

Protected routes use `ProtectedRoute` component (`src/components/ProctectedRoute.tsx` — note the typo in the filename; keep it as-is). Checkout, confirmation, and payment pages do **not** use `MainLayout`.

### App Bootstrap

`main.tsx` wraps the app with `GlobalErrorBoundary` (outside Redux) then `Provider`. On startup, it reads `accessToken` and `refreshToken` from `localStorage` and dispatches `setTokens` + `fetchProfileRequest` to rehydrate the auth session without a full login.

### Redux Store Shape

```ts
{
  auth: {
    user: { id, email, firstName, lastName } | null
    accessToken: string | null
    refreshToken: string | null
    loading: boolean
    profileLoading: boolean   // true while GET /auth/profile is in-flight
    error: string | null
    sessionExpired: boolean
  }
  event: {
    events: Event[]
    pagination: { total, offset, limit, totalPages }
    isLoading: boolean
    error: string | null
    currentEvent: Event | null
    detailLoading: boolean
    detailError: string | null
  }
  home: {
    [section: HomeSectionKey]: { data: Event[], loading: boolean, error: string | null }
    // sections: featured, special, trending, newEvents, music, theatre, festival, conference, sports
  }
  seat: {
    seats: Seat[]
    selectedSeats: string[]     // max 4
    selectedSection: SeatSection | null
    isLoading: boolean
    error: string | null
    lockSuccess: boolean
  }
  booking: {
    bookings: Booking[]
    bookingsLoading: boolean
    currentBooking: Booking | null
    currentBookingLoading: boolean
    isCreating: boolean
    createError: string | null
    createSuccess: boolean
  }
  category: {
    categories: EventCategory[]
    isLoading: boolean
    error: string | null
  }
}
```

### Key Sagas

- **auth.saga** — login (POST /auth/login + GET /auth/profile), register (auto-logs-in by re-dispatching `loginRequest` on success), token refresh
- **event.saga** — fetch events list (with filters), fetch event detail
- **home.saga** — sequential featured/special/trending/newEvents (dedup via ignoreIds), then parallel category fetches
- **seat.saga** (`seat.sage.ts`) — fetch seats, lock/unlock seats (Promise.all), toast on success/error
- **booking.saga** — create booking, fetch my bookings, fetch booking detail
- **category.saga** (`category.sage.ts`) — fetch categories list (GET /categories)

### Key Types (`types/event.types.ts`)

- `Event` — id, title, description, venue, city, category, eventDate, bannerUrl, totalSeats, availableSeats, basePrice, organizer
- `EventDetail` — eventId, endDate, venueAddress, bannerUrl, description, ticketTypes, organizer, isSoldOut
- `EventOrganizer` — id, firstName, lastName, email
- `TicketType` — id, name, price, description, available, section
- `Seat` — id, row, number, label, section, status, priceModifier, isLocked, lockedBy
- `SeatStatus` — `'available' | 'locked' | 'booked'`
- `Booking` — id, seatIds, attendeeName, attendeeEmail, attendeePhone, totalPrice, status, user, event, createdAt, updatedAt, deletedAt
- `BookingUser` — id, firstName, lastName, email
- `BookingEvent` — id, title, venue, city, eventDate, bannerUrl
- `CreateBookingDto` — eventId, seatIds, attendeeName, attendeeEmail, attendeePhone?
- `Category` — id, label, icon (UI display category, distinct from `EventCategory`)
- `EventCategory` — id, name, slug (backend category model)
- `SeatSection` — `'floor' | 'balcony' | 'vip' | 'general'`
- `BookingStatus` — `PENDING | CONFIRMED | CANCELLED`

### HTTP Client (`lib/axios.ts`)

- `baseURL` from `VITE_API_URL` env
- Request interceptor: injects `Authorization: Bearer <token>` from Redux store
- Response interceptor:
  - **429**: shows a Sonner toast with `retry-after` header value; does not retry
  - **401**: queued token refresh (prevents concurrent refresh storms); dispatches `refreshTokenFailed` on failure → sets `sessionExpired: true`
- Tokens are persisted to `localStorage` on login/refresh and rehydrated on boot in `main.tsx`
- **API response envelope**: all endpoints return `{ data: { data: T } }` — sagas read `response.data.data` to get the payload

### State Management Pattern

Uses **Redux Toolkit** for slice/action definitions and **Redux Saga** for async side effects. Service functions in `services/` handle raw HTTP calls; sagas orchestrate async flows and dispatch actions. **Thunk middleware is disabled** (`getDefaultMiddleware({ thunk: false })`).

### Backend Context

The API runs on port 8080:
- Seat availability with Redis locking (max 4 seats per user, 10-min reservation)
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
- Forms: React Hook Form + Zod for validation
- Toasts: use Sonner (`import { toast } from 'sonner'`) for non-blocking feedback
- Formatting helpers: `fmtDate`, `fmtDateRange`, `fmtPrice` from `@/lib/format` (vi-VN locale)
- Class merging: `cn(...)` from `@/lib/utils` (clsx + tailwind-merge)
- Image optimization: `optimizeImage(url, width?)` from `@/utils/image` — transforms any URL through Cloudinary (requires `VITE_CLOUDINARY_CLOUD_NAME`)

## Current Status
Phase 4 UI complete — all pages, Redux slices/sagas, and core components are implemented. Service layer is partially connected (`auth.service.ts` exists; other services call API directly via axios in sagas).

**Implemented:** All 11 pages, 6 Redux slices + sagas (auth, event, home, seat, booking, category), seat selection flow, checkout with countdown, auth with token refresh, skeleton loading states, MSW mock data (categories), ProtectedRoute guard.

## Notes
- Tailwind v4: do not use `@apply` with utility classes — syntax differs from v3
- MSW is only enabled when `VITE_ENABLE_MSW=true` is set in `.env`
- API base URL is injected via `VITE_API_URL` — never hardcode URLs in source code
- Use Redux Saga for all async flows — do not use `createAsyncThunk`
- shadcn/ui components live in `@/components/ui/` — add new ones via CLI: `npx shadcn@latest add <component>`
- Seat locking: max 4 seats, 10-minute countdown on checkout, lock/unlock via saga
- Booking fee: 5% on subtotal + seat section price modifiers
- Two saga files are intentionally misnamed with `.sage.ts` extension: `seat.sage.ts` and `category.sage.ts` — keep as-is to avoid import breakage
- `ProtectedRoute` component file is named `ProctectedRoute.tsx` (typo) — keep as-is
- `SessionExpiredDialog` is rendered globally in `App.tsx` (not inside `MainLayout`) — it listens to `auth.sessionExpired` and shows a modal prompting re-login
