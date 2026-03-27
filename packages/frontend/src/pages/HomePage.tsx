import { useEffect } from 'react'
import { HeroBanner } from '@/components/home/HeroBanner'
import { HeroBannerSkeleton } from '@/components/home/HeroBannerSkeleton'
import { CategoryEventRow } from '@/components/events/CategoryEventRow'
import { CategoryEventRowSkeleton } from '@/components/events/CategoryEventRowSkeleton'
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
        {home.featured.loading
          ? <HeroBannerSkeleton />
          : <HeroBanner events={home.featured.data} />}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">

        {home.special.loading
          ? <CategoryEventRowSkeleton title="Sự kiện đặc biệt" />
          : <CategoryEventRow title="Sự kiện đặc biệt" events={home.special.data} href="/events?type=special" />}

        {home.trending.loading
          ? <CategoryEventRowSkeleton title="Thịnh hành" count={4} />
          : <TrendingSection events={home.trending.data} />}

        {home.newEvents.loading
          ? <CategoryEventRowSkeleton title="Mới nhất" />
          : <CategoryEventRow title="Mới nhất" events={home.newEvents.data} href="/events" />}

        <EventPromoBanner />


        {home.music.loading
          ? <CategoryEventRowSkeleton title="Nhạc sống" />
          : <CategoryEventRow title="Nhạc sống" events={home.music.data} href="/events?category=am-nhac" />}

        {home.theatre.loading
          ? <CategoryEventRowSkeleton title="Sân khấu & Nghệ thuật" />
          : <CategoryEventRow title="Sân khấu & Nghệ thuật" events={home.theatre.data} href="/events?category=kich" />}

        {home.festival.loading
          ? <CategoryEventRowSkeleton title="Lễ hội" />
          : <CategoryEventRow title="Lễ hội" events={home.festival.data} href="/events?category=le-hoi" />}

        {home.conference.loading
          ? <CategoryEventRowSkeleton title="Hội thảo & Workshop" />
          : <CategoryEventRow title="Hội thảo & Workshop" events={home.conference.data} href="/events?category=hoi-nghi" />}

        {home.sports.loading
          ? <CategoryEventRowSkeleton title="Thể thao" />
          : <CategoryEventRow title="Thể thao" events={home.sports.data} href="/events?category=the-thao" />}

        <CitiesSection />

      </div>
    </main>
  )
}
