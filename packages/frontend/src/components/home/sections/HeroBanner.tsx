import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Event } from '@/types/event.types'
import { useAppSelector } from '@/hooks/useAppSelector'
import { HeroBannerSkeleton } from '../HeroBannerSkeleton'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const featured = useAppSelector(state => state.home.featured) 
  const events = featured.data || []
  const pairs = Math.ceil(featured.data.length / 2)
  const next = useCallback(() => setCurrent((c) => (c + 1) % pairs), [pairs])
  const prev = () => setCurrent((c) => (c - 1 + pairs) % pairs)

  useEffect(() => {
    const id = setInterval(next, 4000)
    return () => clearInterval(id)
  }, [next])

  const left = events[current * 2]
  const right = events[current * 2 + 1]

  if(featured.error){
    return <></>
  }

    if(featured.loading) {
    return <HeroBannerSkeleton/>
  }


  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[left, right].filter(Boolean).map((event) => (
          <HeroCard key={event.id} event={event} />
        ))}
      </div>

      {/* Arrow controls */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm shadow flex items-center justify-center hover:bg-black/70 transition-colors z-10"
        aria-label="Trước"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm shadow flex items-center justify-center hover:bg-black/70 transition-colors z-10"
        aria-label="Tiếp theo"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {Array.from({ length: pairs }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              i === current
                ? 'w-6 bg-[oklch(0.6_0.2_250)]'
                : 'w-1.5 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Đến slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

function HeroCard({ event }: { event: Event }) {
  return (
    <Link
      to={`/events/${event.id}`}
      className="group relative h-[320px] rounded-xl overflow-hidden block"
    >
      {event.bannerUrl ? (
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div className="w-full h-full bg-gray-200" />
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <Badge className="mb-2 bg-[oklch(0.6_0.2_250)] text-white border-0 capitalize text-xs">
          {event.category.name}
        </Badge>
        <h3 className="text-white font-bold text-lg leading-snug line-clamp-2 mb-1">
          {event.title}
        </h3>
        <p className="text-white/70 text-xs mb-3">
          {formatDate(event.eventDate)} · {event.venue}
        </p>
        <Button
          size="sm"
          className="bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] text-white h-8 text-xs pointer-events-none"
        >
          Mua vé ngay
        </Button>
      </div>
    </Link>
  )
}
