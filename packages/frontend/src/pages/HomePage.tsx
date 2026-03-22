import { useMemo } from 'react'
import { HeroBanner } from '@/components/home/HeroBanner'
import { CategoryEventRow } from '@/components/events/CategoryEventRow'
import { TrendingSection } from '@/components/events/TrendingSection'
import { WeekendMonthSection } from '@/components/events/WeekendMonthSection'
import { CitiesSection } from '@/components/events/CitiesSection'
import { EventPromoBanner } from '@/components/event-detail/EventPromoBanner'
import {
  mockEvents,
  heroEvents,
  specialEvents,
  trendingEvents,
} from '@/mocks/events.mock'

export function HomePage() {
  const musicEvents = useMemo(
    () => mockEvents.filter(e => e.category === 'music'),
    []
  )
  const theatreEvents = useMemo(
    () => mockEvents.filter(e => e.category === 'theatre'),
    []
  )
  const festivalEvents = useMemo(
    () => mockEvents.filter(e => e.category === 'festival'),
    []
  )
  const conferenceEvents = useMemo(
    () => mockEvents.filter(e => e.category === 'conference'),
    []
  )
  const sportsEvents = useMemo(
    () => mockEvents.filter(e => e.category === 'sports'),
    []
  )

  const forYouEvents = useMemo(
    () => mockEvents.filter((_, i) => [2, 5, 9, 15, 22, 28, 35, 43].includes(i)),
    []
  )

  return (
    <main className="min-h-screen bg-[oklch(0.145_0_0)]">
      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-0">
        <HeroBanner events={heroEvents} />
      </div>

      {/* ── Discovery sections ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">

        {/* Sự kiện đặc biệt */}
        <CategoryEventRow
          title="Sự kiện đặc biệt"
          events={specialEvents}
          href="/events?type=special"
        />

        {/* Sự kiện xu hướng */}
        <TrendingSection events={trendingEvents} />

        {/* Dành cho bạn */}
        <CategoryEventRow
          title="Dành cho bạn"
          events={forYouEvents}
          href="/events"
        />

        {/* Cuối tuần này / Tháng này */}
        <WeekendMonthSection />

        {/* Promo banner */}
        <EventPromoBanner />

        {/* ── Category sections ─────────────────────────────────────────── */}

        <CategoryEventRow
          title="Nhạc sống"
          events={musicEvents}
          href="/events?category=music"
        />

        <CategoryEventRow
          title="Sân khấu & Nghệ thuật"
          events={theatreEvents}
          href="/events?category=theatre"
        />

        <CategoryEventRow
          title="Lễ hội"
          events={festivalEvents}
          href="/events?category=festival"
        />

        <CategoryEventRow
          title="Hội thảo & Workshop"
          events={conferenceEvents}
          href="/events?category=conference"
        />

        <CategoryEventRow
          title="Thể thao"
          events={sportsEvents}
          href="/events?category=sports"
        />

        {/* ── Cities ─────────────────────────────────────────────────────── */}
        <CitiesSection />

      </div>
    </main>
  )
}
