import { useState, useMemo } from 'react'
import { HeroBanner } from '@/components/home/HeroBanner'
import { CategoryNav } from '@/components/home/CategoryNav'
import { EventRow } from '@/components/home/EventRow'
import {
  heroEvents,
  specialEvents,
  trendingEvents,
  upcomingEvents,
} from '@/mocks/events.mock'
import { mockCategories } from '@/mocks/categories.mock'
import type { EventCategory } from '@/types/event.types'

export function HomePage() {
  const [activeCategory, setActiveCategory] = useState<EventCategory | 'all'>('all')

  const filteredSpecial = useMemo(() =>
    activeCategory === 'all'
      ? specialEvents
      : specialEvents.filter((e) => e.category === activeCategory),
    [activeCategory]
  )

  const filteredTrending = useMemo(() =>
    activeCategory === 'all'
      ? trendingEvents
      : trendingEvents.filter((e) => e.category === activeCategory),
    [activeCategory]
  )

  const filteredUpcoming = useMemo(() =>
    activeCategory === 'all'
      ? upcomingEvents
      : upcomingEvents.filter((e) => e.category === activeCategory),
    [activeCategory]
  )

  return (
    <main>
      {/* Hero */}
      <section className="py-6 px-4 max-w-7xl mx-auto">
        <HeroBanner events={heroEvents} />
      </section>

      {/* Category filter + rows */}
      <div className="py-6 px-4 max-w-7xl mx-auto space-y-10">
        <CategoryNav
          categories={mockCategories}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        <EventRow title="Special Events" events={filteredSpecial} href="/events?type=special" />
        <EventRow title="Trending Now" events={filteredTrending} href="/events?type=trending" />
        <EventRow title="Upcoming" events={filteredUpcoming} href="/events?type=upcoming" />
      </div>
    </main>
  )
}
