import { memo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { EventGridCard } from '@/components/common/EventGridCard'
import type { Event } from '@/types/event.types'

interface CategoryEventRowProps {
  title: string
  events: Event[]
  href: string
  limit?: number
}

export const CategoryEventRow = memo(function CategoryEventRow({
  title,
  events,
  href,
  limit = 8,
}: CategoryEventRowProps) {
  if (events.length === 0) return null

  return (
    <section aria-labelledby={`row-${title.replace(/\s/g, '-')}`}>
      <div className="flex items-center justify-between mb-4">
        <h2
          id={`row-${title.replace(/\s/g, '-')}`}
          className="text-white font-bold text-lg"
        >
          {title}
        </h2>
        <Link
          to={href}
          className="text-[oklch(0.6_0.2_250)] text-sm hover:underline flex items-center gap-0.5 shrink-0"
        >
          Xem thêm <ChevronRight size={14} aria-hidden="true" />
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
        {events.slice(0, limit).map(event => (
          <div key={event.id} className="min-w-[190px] max-w-[190px] sm:min-w-[210px] sm:max-w-[210px]">
            <EventGridCard event={event} />
          </div>
        ))}
      </div>
    </section>
  )
})
