import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Event } from '@/types/event.types'

interface HeroBannerProps {
  events: Event[]
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function HeroBanner({ events }: HeroBannerProps) {
  const [current, setCurrent] = useState(0)
  const pairs = Math.ceil(events.length / 2)

  const next = useCallback(() => setCurrent((c) => (c + 1) % pairs), [pairs])
  const prev = () => setCurrent((c) => (c - 1 + pairs) % pairs)

  useEffect(() => {
    const id = setInterval(next, 4000)
    return () => clearInterval(id)
  }, [next])

  const left = events[current * 2]
  const right = events[current * 2 + 1]

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
        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors z-10"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors z-10"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
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
                : 'w-1.5 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${i + 1}`}
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
          {event.category}
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
          Get Tickets
        </Button>
      </div>
    </Link>
  )
}
