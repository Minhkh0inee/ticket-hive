import { ChevronRight } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { EventGridCard } from '../common/EventGridCard'
import type { Event, EventCategory } from '@/types/event.types'

type EventRelatedSectionProps = {
    category: EventCategory
    relatedEvents: Event[]
}

const EventRelatedSection: React.FC<EventRelatedSectionProps> = ({category, relatedEvents}) => {
  return (
         <section aria-labelledby="related-heading" className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 id="related-heading" className="text-white font-bold text-lg">
                Có thể bạn cũng thích
              </h2>
              <Link
                to={`/events?category=${category}`}
                className="text-[oklch(0.6_0.2_250)] text-sm hover:underline flex items-center gap-1"
              >
                Xem tất cả <ChevronRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {relatedEvents.map(e => <EventGridCard key={e.id} event={e} />)}
            </div>
          </section>
  )
}

export default EventRelatedSection