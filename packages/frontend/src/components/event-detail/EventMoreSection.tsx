import { EventGridCard } from '@/components/common/EventGridCard'
import { Button } from '@/components/ui/button'
import type { Event } from '@/types/event.types'
import { ChevronRight } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

type EventMoreSectionProps = {
  moreEvents: Event[]
}

const EventMoreSection: React.FC<EventMoreSectionProps> = ({ moreEvents }) => {
  return (
    <section aria-labelledby="more-heading" className="mb-10">
      <h2 id="more-heading" className="text-white font-bold text-lg mb-5">
        Sự kiện khác
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {moreEvents.map(e => <EventGridCard key={e.id} event={e} />)}
      </div>
      <div className="flex justify-center">
        <Button
          variant="outline"
          asChild
          className="rounded-full border-[oklch(0.6_0.2_250)] text-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.6_0.2_250)] hover:text-white bg-transparent px-8"
        >
          <Link to="/events">
            Xem thêm sự kiện
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  )
}

export default EventMoreSection