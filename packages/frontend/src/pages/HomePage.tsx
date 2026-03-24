import { useEffect } from 'react'
import { HeroBanner } from '@/components/home/HeroBanner'
import { CategoryEventRow } from '@/components/events/CategoryEventRow'
import { TrendingSection } from '@/components/events/TrendingSection'
import { CitiesSection } from '@/components/events/CitiesSection'
import { EventPromoBanner } from '@/components/event-detail/EventPromoBanner'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { loadHomePageRequest } from '@/stores/slices/home.slice'

export function HomePage() {
  const dispatch = useAppDispatch()
  const home = useAppSelector(state => state.home)

  useEffect(() => {
    dispatch(loadHomePageRequest())
  }, [dispatch])
  return (
    <main className="min-h-screen bg-[oklch(0.145_0_0)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-0">
        <HeroBanner events={home.featured.data} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">

        <CategoryEventRow
          title="Sự kiện đặc biệt"
          events={home.special.data}
          href="/events?type=special"
        />

        <TrendingSection events={home.trending.data} />

        <CategoryEventRow
          title="Mới nhất"
          events={home.newEvents.data}
          href="/events"
        />

        <EventPromoBanner />


        <CategoryEventRow
          title="Nhạc sống"
          events={home.music.data}
          href="/events?category=music"
        />

        <CategoryEventRow
          title="Sân khấu & Nghệ thuật"
          events={home.theatre.data}
          href="/events?category=theatre"
        />

        <CategoryEventRow
          title="Lễ hội"
          events={home.festival.data}
          href="/events?category=festival"
        />

        <CategoryEventRow
          title="Hội thảo & Workshop"
          events={home.conference.data}
          href="/events?category=conference"
        />

        <CategoryEventRow
          title="Thể thao"
          events={home.sports.data}
          href="/events?category=sports"
        />

        <CitiesSection />

      </div>
    </main>
  )
}
